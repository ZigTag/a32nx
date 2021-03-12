/*
 * A32NX
 * Copyright (C) 2020-2021 FlyByWire Simulations and its contributors
 *
 * This program is free software: you can redistribute it and/or modify
 * it under the terms of the GNU General Public License as published by
 * the Free Software Foundation, either version 3 of the License, or
 * (at your option) any later version.
 *
 * This program is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 * GNU General Public License for more details.
 *
 * You should have received a copy of the GNU General Public License
 * along with this program.  If not, see <http://www.gnu.org/licenses/>.
 */

import React, { useState } from 'react';
import { IconBox, IconLink, IconPlane } from '@tabler/icons';
import { IconPlaneDeparture } from '@tabler/icons';
import { IconPlaneArrival } from '@tabler/icons';
import nose from '../../Assets/320neo-outline-nose.svg';

type FlightWidgetProps = {
    name: string,
    airline: string,
    flightNum: string,
    aircraftReg: string,
    dep: string,
    depIata: string,
    arr: string,
    arrIata: string,
    std: string,
    sta: string,
    distance: string,
    eta: string,
    timeSinceStart: string,
    fetchSimbrief: Function,
    route: string,
    altIcao: string,
    costInd: string
}


const FlightWidget = (props: FlightWidgetProps) => {

	const resolveFlightName = () => {
		const airline = typeof props.airline === 'string' ? props.airline : "";
		return `${airline}${props.flightNum}`;
	}

    return (
        <div id={'flight-' + props.name} className="w-2/5 h-efb bg-blue-dark text-white rounded-xl mr-3 shadow-lg p-6 overflow-hidden">
            <div className="h-full flex flex-col justify-between">
                <div className="w-full mb-3">
                    <div className="text-center mb-6">
                        <h1 className="text-2xl font-medium">{resolveFlightName()}</h1>
                        <span>{props.aircraftReg}</span> <br />
                        <span>A320-251N</span>
                    </div>

                    <div className="flex items-center justify-center mb-6 text-lg">
                        [{props.depIata}] <span className="mx-3 text-3xl">{props.dep}</span>
                        <IconPlane size={35} stroke={1.5} strokeLinejoin="miter" />
                        <span className="mx-3 text-3xl">{props.arr}</span> [{props.arrIata}]
                    </div>

                    <div className="flex mb-6">
                        <div className="w-1/2 mr-4">
                            <div className="flex justify-end text-lg">
                                STD <IconPlaneDeparture className="ml-2" size={23} stroke={1.5} strokeLinejoin="miter" />
                            </div>
                            <div className="text-right mt-1 text-2xl">{props.std}</div>
                        </div>
                        <div className="w-1/2 ml-4">
                            <div className="flex justify-start text-lg">
                                <IconPlaneArrival className="mr-2" size={23} stroke={1.5} strokeLinejoin="miter" /> STA
                            </div>
                            <div className="text-left mt-1 text-2xl">{props.sta}</div>
                        </div>
                    </div>

                    <div className="flex justify-center text-center text-lg max-w-md uppercase font-mono">
                        {props.route} [{props.distance}]
                    </div>
                </div>
                <div className="w-full my-3">
                    <img src={nose} className="w-96 flip-vertical -ml-44" />
                </div>
                <div className="w-full mt-3">
                    <div className="grid grid-cols-3 gap-4 text-center mb-10">
                        <div className="mb-3">
                            <h3 className="text-xl font-medium">ALTN</h3>
                            <span className="text-lg font-mono font-thin">{props.altIcao}</span>
                        </div>
                        <div className="mb-3">
                            <h3 className="text-xl font-medium">CO RTE</h3>
                            <span className="text-lg font-mono font-thin">{props.depIata + props.arrIata}</span>
                        </div>
                        <div className="mb-3">
                            <h3 className="text-xl font-medium">ZFW</h3>
                            <span className="text-lg font-mono font-thin">59.4</span>
                        </div>
                        <div>
                            <h3 className="text-xl font-medium">AVG WIND</h3>
                            <span className="text-lg font-mono font-thin">VIJP</span>
                        </div>
                        <div>
                            <h3 className="text-xl font-medium">CI</h3>
                            <span className="text-lg font-mono font-thin">{props.costInd}</span>
                        </div>
                        <div>
                            <h3 className="text-xl font-medium">CRZ TEMP</h3>
                            <span className="text-lg font-mono font-thin">VIJP</span>
                        </div>
                    </div>
                    <div className="flex">
                        <button onClick={() => props.fetchSimbrief()} className="mr-1 w-1/2 text-white bg-blue-fbw p-2 flex items-center justify-center rounded-lg focus:outline-none">
                            <IconBox className="mr-2" size={23} stroke={1.5} strokeLinejoin="miter" /> FROM SIMBRIEF
                        </button>
                        <button className="ml-1 w-1/2 text-white bg-green-500 p-2 flex items-center justify-center rounded-lg focus:outline-none">
                            <IconLink className="mr-2" size={23} stroke={1.5} strokeLinejoin="miter" /> LINK MCDU
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default FlightWidget;
