import * as DateUtils from './utils/dates.js';

/**
 * Calculates the current and longest streaks in input dates
 * @param {Array<string>} dates an array of dates in the YYYY-MM-DD format
 * @returns an object with properties current and longest, holding the current and longest streaks, respectively
 */
export function getStreaks(dates) {
    if (dates.length === 0) return { current: 0, longest: 0 };
    const sorted = dates.map(d => new Date(d)).sort((a, b) => a - b);
    let playedToday = false;
    let current = 1, longest = 1;
    for (let i = 1; i < sorted.length; i++) {
        const diff = (sorted[i] - sorted[i - 1]) / (1000 * 60 * 60 * 24);
        if (diff === 1) {
            current++;
            longest = Math.max(longest, current);
        } else {
            current = 1;
        }
        if (dates[i] === DateUtils.todayYMD) {
            playedToday = true;
        }
    }

    if (!playedToday) {
        current = 0;
    }

    return { current, longest };
}