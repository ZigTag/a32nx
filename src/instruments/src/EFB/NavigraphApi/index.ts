export interface ChartType {
    code: string,
    category: string,
    details: string,
    precision: string,
    section: string,
}

export interface Chart {
    fileDay: string,
    fileNight: string,
    thumbDay: string,
    thumbNight: string,
    icaoAirportIdentifier: string,
    id: string,
    extId: string,
    fileName: string,
    type: ChartType,
    procedureIdentifier: string,
    fetchImage: CallableFunction,
}

export type AirportCharts = {
    arrival: Chart[],
    departure: Chart[],
    airport: Chart[],
    approach: Chart[],
};

function formatFormBody(body: Object) {
    return Object.keys(body).map((key) => `${encodeURIComponent(key)}=${encodeURIComponent(body[key])}`).join('&');
}

export default class NavigraphClient {
    private static clientId = process.env.CLIENT_ID;

    private static clientSecret = process.env.CLIENT_SECRET;

    private deviceCode: string;

    private refreshToken: string | null;

    private accessToken: string;

    public authCode: string;

    public authQRLink: string;

    public authInterval: number = 5;

    public static sufficientEnv() {
        return !(NavigraphClient.clientSecret === undefined || NavigraphClient.clientId === undefined);
    }

    constructor() {
        if (NavigraphClient.sufficientEnv()) {
            const token = window.localStorage.getItem('refreshToken');

            if (token === undefined || token === null) {
                this.authenticate();
            } else {
                this.refreshToken = token;
                this.getToken();
            }
        }
    }

    private authenticate() {
        const secret = {
            client_id: NavigraphClient.clientId,
            client_secret: NavigraphClient.clientSecret,
        };

        fetch('https://identity.api.navigraph.com/connect/deviceauthorization', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded;charset=UTF-8',
            },
            body: formatFormBody(secret),
        }).then((resp) => {
            if (resp.ok) {
                resp.json().then((r) => {
                    this.authCode = r.user_code;
                    this.authQRLink = r.verification_uri_complete;
                    this.authInterval = r.interval;
                    this.deviceCode = r.device_code;
                });
            }
        });
    }

    private tokenCall(body) {
        fetch('https://identity.api.navigraph.com/connect/token/', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded;charset=UTF-8',
            },
            body: formatFormBody(body),
        }).then((resp) => {
            if (resp.ok) {
                resp.json().then((r) => {
                    const refreshToken = r.refresh_token;

                    this.refreshToken = refreshToken;
                    this.accessToken = r.access_token;

                    window.localStorage.setItem('refreshToken', refreshToken);
                });
            }
        });
    }

    public getToken() {
        if (NavigraphClient.sufficientEnv()) {
            if (!this.refreshToken) {
                const tokenBody = {
                    grant_type: 'urn:ietf:params:oauth:grant-type:device_code',
                    device_code: this.deviceCode,
                    client_id: NavigraphClient.clientId,
                    client_secret: NavigraphClient.clientSecret,
                    scope: 'openid charts offline_access',
                };

                this.tokenCall(tokenBody);
            } else {
                const tokenBody = {
                    grant_type: 'refresh_token',
                    refresh_token: this.refreshToken,
                    client_id: NavigraphClient.clientId,
                    client_secret: NavigraphClient.clientSecret,
                };

                this.tokenCall(tokenBody);
            }
        }
    }

    public async chartCall(icao: string, item: string): Promise<string> {
        const callResp = await fetch(`https://charts.api.navigraph.com/2/airports/${icao}/signedurls/${item}`, {
            headers: {
                Authorization: `Bearer ${this.accessToken}`,
            },
        });

        if (callResp.ok) {
            return callResp.text();
        }
        return Promise.reject();
    }

    public async getChartList(icao: string): Promise<AirportCharts> {
        if (this.hasToken()) {
            const chartJsonUrl = await this.chartCall(icao, 'charts.json');

            const chartJsonResp = await fetch(chartJsonUrl);

            if (chartJsonResp.ok) {
                const chartJson = await chartJsonResp.json();

                const chartArray: Chart[] = chartJson.charts.map((chart) => ({
                    fileDay: chart.file_day,
                    fileNight: chart.file_night,
                    thumbDay: chart.thumb_day,
                    thumbNight: chart.thumb_night,
                    icaoAirportIdentifier: chart.icao_airport_identifier,
                    id: chart.id,
                    extId: chart.ext_id,
                    fileName: chart.file_name,
                    type: {
                        code: chart.type.code,
                        category: chart.type.category,
                        details: chart.type.details,
                        precision: chart.type.precision,
                        section: chart.type.section,
                    },
                    procedureIdentifier: chart.procedure_identifier,
                }));

                return {
                    arrival: chartArray.filter((chart) => chart.type.category === 'ARRIVAL'),
                    departure: chartArray.filter((chart) => chart.type.category === 'DEPARTURE'),
                    airport: chartArray.filter((chart) => chart.type.category === 'AIRPORT'),
                    approach: chartArray.filter((chart) => chart.type.category === 'APPROACH'),
                };
            }
        }

        return {
            airport: [],
            approach: [],
            departure: [],
            arrival: [],
        };
    }

    public hasToken() {
        return !!this.accessToken;
    }

    public async subscriptionStatus() {
        if (this.hasToken()) {
            const subscriptionResp = await fetch('https://subscriptions.api.navigraph.com/2/subscriptions/valid', {
                headers: {
                    Authorization: `Bearer ${this.accessToken}`,
                },
            });

            if (subscriptionResp.ok) {
                const subscriptionJson = await subscriptionResp.json();

                return subscriptionJson.subscription_name;
            }
        }

        return '';
    }
}
