import Text from "../../component/Text";
import Divider from "../../component/Divider";
import { css, cx } from "@linaria/core";
import DDay from "./DDay";
import { format } from "date-fns";
import View from "../../core/View.tsx";
import FadeIn from "../../Custom/FadeIn";
import { ko } from "date-fns/locale";
import {
    getWeddingScheduleDetails,
    WEDDING_LOCATION,
    WEDDING_LOCATION_NAME,
} from '../../../../../../config';

function WeddingDayTemplate() {
    const { date, isValidDate } = getWeddingScheduleDetails();
    const calendar = isValidDate ? getCalendar(date) : null;

    return (
        <View ui={css`
            gap: 40px;
            align-items: center;
            padding: 92px 22px;
            background: white;
        `}>
            <FadeIn>
                <Text size={20} weight={300} ui={css`
                    color: var(--g-600);
                `}>WEDDING DAY</Text>
            </FadeIn>
            <FadeIn>
                {isValidDate && (
                    <Text size={16} ui={css`
                        color: var(--g-900);
                        white-space: pre-wrap;
                        text-align: center;
                    `}>
                        {format(date, "yyyy년 M월 d일 EEEE", { locale: ko })}
                        {'\n'}
                        {format(date, "a h시 mm분", { locale: ko })}
                        {'\n'}
                        {WEDDING_LOCATION} / {WEDDING_LOCATION_NAME}
                    </Text>
                )}
            </FadeIn>
            {(
                <View ui={css`
                    align-self: stretch;
                    gap: 25px;
                `}>
                    <FadeIn>
                        <Divider />
                    </FadeIn>
                    <FadeIn>
                        <View as={'table'} className={css`
                            gap: 8px;
                            margin: 24px 19px;
                        `}>
                            <View as={'thead'} className={css`
                                display: flex;
                                flex-direction: row !important;
                                padding: 12px 14px;
                            `}>
                                <View as={'tr'} className={css`
                                    display: flex;
                                    flex-direction: row !important;
                                    justify-content: space-between;
                                    color: var(--g-500);
                                    flex: 1;
                                `}>
                                    {['일', '월', '화', '수', '목', '금', '토'].map((i, index) => (
                                        <FadeIn as={'th'} delay={index * 10} ui={css`
                                        `} key={index}>
                                            <Text
                                                font={'Pretendard'}
                                                size={16}
                                                weight={300}
                                                ui={css`
                                                    color: var(--g-500);
                                                `}
                                            >{i}</Text>
                                        </FadeIn>
                                    ))}
                                </View>
                            </View>
                            <View as={'tbody'} className={css`
                                gap: 4px;
                            `}>
                                {calendar && calendar.map((week, weekIndex) => (
                                    <View as={'tr'} key={weekIndex} className={css`
                                        display: flex;
                                        flex-direction: row !important;
                                        align-items: flex-start;
                                    `}>
                                        {week.map((day, dayIndex) => (
                                            <FadeIn key={dayIndex} delay={weekIndex * 160 + dayIndex * 160}>
                                                {provided => (
                                                    <View
                                                        as={'td'}
                                                        key={dayIndex}
                                                        ref={provided.ref}
                                                        className={cx(
                                                            css`
                                                                display: flex;
                                                                flex-direction: row !important;
                                                                align-items: center;
                                                                justify-content: center;
                                                                flex: 1;
                                                                height: 48px;
                                                                border-radius: 100px;
                                                            `,
                                                            day.isWeddingDay && css`
                                                                    background: var(--p-300);
                                                            `,
                                                            provided.style
                                                        )}
                                                    >
                                                        <Text
                                                            font={'Pretendard'} size={16} weight={300}
                                                            ui={(dayIndex === 0 || dayIndex === 6) ?
                                                                css`
                                                                    opacity: 0.4;
                                                                ` : undefined
                                                            }
                                                        >
                                                            {day.day ?? ''}
                                                        </Text>
                                                    </View>
                                                )}
                                            </FadeIn>
                                        ))}
                                    </View>
                                ))}
                            </View>
                        </View>
                    </FadeIn>
                    <FadeIn>
                        <Divider />
                    </FadeIn>
                </View>
            )}
            {(
                <DDay />
            )}
        </View>
    );
}

function getCalendar(date: Date) {
    const year = date.getFullYear();
    const month = date.getMonth();

    // 첫 번째 날과 마지막 날 구하기
    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);
    const firstDayOfWeek = firstDay.getDay();
    const lastDate = lastDay.getDate();

    const calendar = [];
    let week = [];

    // 첫 번째 주의 빈 칸 채우기
    for (let i = 0; i < firstDayOfWeek; i++) {
        week.push(null);
    }

    // 날짜 추가
    for (let date = 1; date <= lastDate; date++) {
        week.push(date);

        // 주가 끝나면 새로운 주를 시작
        if (week.length === 7) {
            calendar.push(week);
            week = [];
        }
    }

    // 마지막 주의 빈 칸 채우기
    while (week.length < 7) {
        week.push(null);
    }

    if (week.length > 0) {
        calendar.push(week);
    }

    return calendar.map(week =>
        week.map(day => ({
            day,
            isWeddingDay: day === date.getDate()
            // date.getMonth() === date.getMonth() &&
            // date.getFullYear() === date.getFullYear()
        }))
    );
}

export default WeddingDayTemplate;