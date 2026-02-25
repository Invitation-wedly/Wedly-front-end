import { useEffect, useMemo, useState } from 'react';
import Text from "../../component/Text";
import FadeIn from "../../Custom/FadeIn";
import View from "../../core/View";
import { css } from "@linaria/core";
import { styled } from "@linaria/react";
import {
    BRIDE_NAME,
    GROOM_NAME,
    getWeddingScheduleDetails,
} from '../../../../../../config';

type RemainTime = {
    days: number;
    hours: number;
    minutes: number;
    seconds: number;
}

const ZERO_REMAINING_TIME: RemainTime = {
    days: 0,
    hours: 0,
    minutes: 0,
    seconds: 0,
};

function DDay() {
    const [remainingTime, setRemainingTime] = useState<RemainTime>(ZERO_REMAINING_TIME);
    const { isValidDate, weddingTimeMs } = useMemo(() => {
        const { date, isValidDate } = getWeddingScheduleDetails();
        return {
            isValidDate,
            weddingTimeMs: date.getTime(),
        };
    }, []);

    useEffect(() => {
        const calculateRemainingTime = () => {
            if (!isValidDate || Number.isNaN(weddingTimeMs)) {
                setRemainingTime(prev => {
                    if (
                        prev.days === 0 &&
                        prev.hours === 0 &&
                        prev.minutes === 0 &&
                        prev.seconds === 0
                    ) {
                        return prev;
                    }
                    return ZERO_REMAINING_TIME;
                });
                return;
            }

            const now = new Date();
            const timeDiff = weddingTimeMs - now.getTime();

            // 시간 차가 음수일 경우 결혼식이 이미 지났다는 의미
            if (timeDiff <= 0) {
                setRemainingTime(prev => {
                    if (
                        prev.days === 0 &&
                        prev.hours === 0 &&
                        prev.minutes === 0 &&
                        prev.seconds === 0
                    ) {
                        return prev;
                    }
                    return ZERO_REMAINING_TIME;
                });
                return;
            }

            const nextRemainingTime: RemainTime = {
                days: Math.floor(timeDiff / (1000 * 60 * 60 * 24)), // 남은 일수
                hours: Math.floor((timeDiff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)),
                minutes: Math.floor((timeDiff % (1000 * 60 * 60)) / (1000 * 60)),
                seconds: Math.floor((timeDiff % (1000 * 60)) / 1000)
            };

            setRemainingTime(prev => {
                if (
                    prev.days === nextRemainingTime.days &&
                    prev.hours === nextRemainingTime.hours &&
                    prev.minutes === nextRemainingTime.minutes &&
                    prev.seconds === nextRemainingTime.seconds
                ) {
                    return prev;
                }
                return nextRemainingTime;
            });
        };

        calculateRemainingTime();
        const interval = setInterval(calculateRemainingTime, 1000);

        return () => {
            clearInterval(interval);
        };
    }, [isValidDate, weddingTimeMs]);

    return (
        <View ui={css`
            align-items: center;
            gap: 24px;
        `}>
            <RemainTimeComponent
                remainingTime={remainingTime}
            />
            <FadeIn>
                <View ui={css`
                    flex-direction: row !important;
                    gap: 4px;
                `}>
                    <Text size={14} weight={300}>{GROOM_NAME}</Text>
                    <Text size={16}>❤️</Text>
                    <Text size={14} weight={300}>{BRIDE_NAME}의 결혼식이</Text>
                    <Text size={14} weight={300} ui={css`
                        color: var(--p-800);
                    `}>{remainingTime.days}</Text>
                    <Text size={14} weight={300}>일 남았습니다.</Text>
                </View>
            </FadeIn>
        </View>
    );
}

function RemainTimeComponent(
    {
        remainingTime
    }: {
        remainingTime: RemainTime
    }
) {
    // switch (dDayStyle) {
    //     case 'style1':
    //         return (
    return (
        <View ui={css`
            flex-direction: row !important;
            gap: 12px;
            align-items: center;
            padding: 0 50px;
        `}>
            <FadeIn>
                <S.dateCell>
                    <Text size={12} weight={400} ui={css`
                        color: var(--g-300);
                    `}>DAYS</Text>
                    <Text size={24} weight={300} ui={css`
                        color: var(--g-600);
                    `}>{remainingTime.days}</Text>
                </S.dateCell>
            </FadeIn>
            <FadeIn delay={120}>
                <S.dateCell>
                    <Text size={12} weight={400} ui={css`
                        color: var(--g-300);
                    `}>HOUR</Text>
                    <Text size={24} weight={300} ui={css`
                        color: var(--g-600);
                    `}>{remainingTime.hours}</Text>
                </S.dateCell>
            </FadeIn>
            <FadeIn delay={240}>
                <S.dateCell>
                    <Text size={12} weight={400} ui={css`
                        color: var(--g-300);
                    `}>MIN</Text>
                    <Text size={24} weight={300} ui={css`
                        color: var(--g-600);
                    `}>{remainingTime.minutes}</Text>
                </S.dateCell>
            </FadeIn>
            <FadeIn delay={360}>
                <S.dateCell>
                    <Text size={12} weight={400} ui={css`
                        color: var(--g-300);
                    `}>SEC</Text>
                    <Text size={24} weight={300} ui={css`
                        color: var(--g-600);
                    `}>{remainingTime.seconds}</Text>
                </S.dateCell>
            </FadeIn>
        </View>
    );
}

const S = {
    dateCell: styled.div`
        display: flex;
        flex-direction: column;
        width: 64px;
        padding: 17px 16px 16px 16px;
        justify-content: center;
        align-items: center;
        border-radius: 8px;
        gap: 4px;
        background: white;
        box-shadow: 0 3px 8px 0 rgba(0, 0, 0, 0.16);
    `
}

export default DDay;
