import React, { useState } from 'react';
import QRCode from 'qrcode.react';
import useInterval from '../../../Common/useInterval';
import NavigraphClient, { AirportCharts } from '../../NavigraphApi';

type ChartButtonsType = {
    navigraph: NavigraphClient,
    icao: string,
    isDisplayingCharts: boolean,
    setCharts: CallableFunction
}

type ChartSelectorType = {
    navigraph: NavigraphClient,
    icao: string,
    isDisplayingCharts: boolean,
    charts: AirportCharts,
    imageLink: string,
    setImageLink: CallableFunction,
}

const ChartButtons: React.FC<ChartButtonsType> = (props) => (
    <>
        {!props.isDisplayingCharts ? (
            <div className="flex text-white font-medium mt-6 ml-6 text-medium">
                <button type="button" className="flex-1">Get Subscription Status (inop)</button>
                <button
                    type="button"
                    className="flex-1"
                    onClick={() => props.navigraph.getChartList(props.icao).then((r) => props.setCharts(r))}
                >
                    Get Chart List
                </button>
                {!props.navigraph.hasToken() && props.navigraph.authQRLink
                    ? (
                        <div>
                            <QRCode style={{ width: '512px', height: '512px' }} value={props.navigraph.authQRLink} />
                            <p className="text-xl">{props.navigraph.authCode}</p>
                        </div>
                    )
                    : <></>}
                {props.navigraph.hasToken()
                    ? <p className="flex-1 justify-center">Has Token</p>
                    : <p className="flex-1 justify-center">Does not have Token</p>}
            </div>
        )
            : <></>}
    </>
);

const ChartSelector: React.FC<ChartSelectorType> = (props) => (
    <>
        {!props.isDisplayingCharts
            ? (
                <div className="flex text-white ml-6 overflow-scroll h-144">
                    <div className="flex flex-col flex-1 m-2">
                        <p className="text-3xl mb-4">Arrival</p>
                        {props.charts.arrival.map((chart) => (
                            <button
                                type="button"
                                className="bg-gray-800 rounded-xl p-2 mb-2 text-white shadow-lg"
                                onClick={() => props.navigraph.chartCall(props.icao, chart.fileDay).then((r) => props.setImageLink(r))}
                            >
                                {chart.procedureIdentifier}
                            </button>
                        ))}
                    </div>
                    <div className="flex flex-col flex-1 m-2">
                        <p className="text-3xl mb-4">Departure</p>
                        {props.charts.departure.map((chart) => (
                            <button
                                type="button"
                                className="bg-gray-800 rounded-xl p-2 mb-2 text-white shadow-lg"
                                onClick={() => props.navigraph.chartCall(props.icao, chart.fileDay).then((r) => props.setImageLink(r))}
                            >
                                {chart.procedureIdentifier}
                            </button>
                        ))}
                    </div>
                    <div className="flex flex-col flex-1 m-2">
                        <p className="text-3xl mb-4">Airport</p>
                        {props.charts.airport.map((chart) => (
                            <button
                                type="button"
                                className="bg-gray-800 rounded-xl p-2 mb-2 text-white shadow-lg"
                                onClick={() => props.navigraph.chartCall(props.icao, chart.fileDay).then((r) => props.setImageLink(r))}
                            >
                                {chart.procedureIdentifier}
                            </button>
                        ))}
                    </div>
                    <div className="flex flex-col flex-1 m-2">
                        <p className="text-3xl mb-4">Approach</p>
                        {props.charts.approach.map((chart) => (
                            <button
                                type="button"
                                className="bg-gray-800 rounded-xl p-2 mb-2 text-white shadow-lg"
                                onClick={() => props.navigraph.chartCall(props.icao, chart.fileDay).then((r) => props.setImageLink(r))}
                            >
                                {chart.procedureIdentifier}
                            </button>
                        ))}
                    </div>
                </div>
            )
            : (
                <div className="overflow-scroll h-160">
                    <button
                        type="button"
                        className="text-white font-medium mt-6 ml-4 text-lg"
                        onClick={() => props.setImageLink('')}
                    >
                        Close chart
                    </button>
                    <img src={props.imageLink} />
                </div>
            )}
    </>
);

const Charts = () => {
    const [navigraph] = useState(() => new NavigraphClient());
    const [charts, setCharts] = useState<AirportCharts>({
        approach: [],
        airport: [],
        departure: [],
        arrival: [],
    });
    const [icao] = useState<string>('KLAX');
    const [imageLink, setImageLink] = useState<string>('');

    const isDisplayingChart = imageLink !== '';

    useInterval(() => {
        if (!navigraph.hasToken()) {
            navigraph.getToken();
        }
    }, (navigraph.authInterval * 1000));

    return (
        <div className="w-full h-full bg-blue-darker">
            <p className="text-white font-medium mt-6 ml-4 text-3xl">Charts</p>
            {NavigraphClient.sufficientEnv()
                ? (
                    <>
                        <ChartButtons navigraph={navigraph} icao={icao} isDisplayingCharts={isDisplayingChart} setCharts={setCharts} />
                        <ChartSelector navigraph={navigraph} icao={icao} isDisplayingCharts={isDisplayingChart} charts={charts} imageLink={imageLink} setImageLink={setImageLink} />
                    </>
                )
                : <p className="text-white font-medium mt-6 ml-4 text-lg">You don't have navigraph credentials set up</p>}
        </div>
    );
};

export default Charts;
