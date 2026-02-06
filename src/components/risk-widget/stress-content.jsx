import React, { useEffect, useState } from "react";
import "./stress-content.css";


export default function StressContent({ teams = [] }) {

    return (
        <>
            <div className="percent-employee-uphead">
                <div className="percent-employee-teams">Команды</div>
                <div className="percent-employee-normal">Нормальный</div>
                <div className="stroka"></div>
                <div className="percent-employee-light">Легкий</div>
                <div className="stroka"></div>
                <div className="percent-employee-medium">Умеренный</div>
                <div className="stroka"></div>
                <div className="percent-employee-high">Высокий</div>
                <div className="stroka"></div>
                <div className="percent-employee-critical">Критический</div>
            </div>
            <div className="percent-employee-main">
                {teams.map((team, idx) => (
                    <div className="percent-employee-row" key={idx}>
                        <div className="percent-employee-rowteams">
                            <h1>{team.label  || 'Без названия'}</h1>
                        </div>

                        <div className="stroka"></div>
                        <div className="percent-employee-rownormal">
                            <div className="progress-risk">
                                <div className="progress-bar-base">
                                    <div
                                        className="progress-bar-normal"
                                        style={{
                                            width: `${Math.round(team.stress?.Normal?.percent || 0)}%`,
                                            minWidth:
                                                Math.round(team.stress?.Normal?.percent || 0) === 0 ? '1px' : undefined,
                                        }}
                                    />
                                </div>
                                <span>{Math.round(team.stress?.Normal?.percent || 0)}%</span>
                            </div>
                        </div>

                        <div className="stroka"></div>
                        <div className="percent-employee-rowlight">
                            <div className="progress-risk">
                                <div className="progress-bar-base">
                                    <div
                                        className="progress-bar-light"
                                        style={{
                                            width: `${Math.round(team.stress?.Mild?.percent || 0)}%`,
                                            minWidth:
                                                Math.round(team.stress?.Mild?.percent || 0) === 0 ? '1px' : undefined,
                                        }}
                                    />
                                </div>
                                <span>{Math.round(team.stress?.Mild?.percent || 0)}%</span>
                            </div>
                        </div>

                        <div className="stroka"></div>
                        <div className="percent-employee-rowmedium">
                            <div className="progress-risk">
                                <div className="progress-bar-base">
                                    <div
                                        className="progress-bar-medium"
                                        style={{
                                            width: `${Math.round(team.stress?.Moderate?.percent || 0)}%`,
                                            minWidth:
                                                Math.round(team.stress?.Moderate?.percent || 0) === 0 ? '1px' : undefined,
                                        }}
                                    />
                                </div>
                                <span>{Math.round(team.stress?.Moderate?.percent || 0)}%</span>
                            </div>
                        </div>

                        <div className="stroka"></div>
                        <div className="percent-employee-rowhigh">
                            <div className="progress-risk">
                                <div className="progress-bar-base">
                                    <div
                                        className="progress-bar-high"
                                        style={{
                                            width: `${Math.round(team.stress?.High?.percent || 0)}%`,
                                            minWidth:
                                                Math.round(team.stress?.High?.percent || 0) === 0 ? '1px' : undefined,
                                        }}
                                    />
                                </div>
                                <span>{Math.round(team.stress?.High?.percent || 0)}%</span>
                            </div>
                        </div>

                        <div className="stroka"></div>
                        <div className="percent-employee-rowcritical">
                            <div className="progress-risk">
                                <div className="progress-bar-base">
                                    <div
                                        className="progress-bar-critical"
                                        style={{
                                            width: `${Math.round(team.stress?.Very_High?.percent || 0)}%`,
                                            minWidth:
                                                Math.round(team.stress?.Very_High?.percent || 0) === 0 ? '1px' : undefined,
                                        }}
                                    />
                                </div>
                                <span>{Math.round(team.stress?.Very_High?.percent || 0)}%</span>
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </>
    );
}