const SCREENSHOT_PREFIX = 'data:image/jpeg;base64,';
const PASS_THRESHOLD = 0.9;
const RATINGS = {
    PASS: {label: 'pass', minScore: PASS_THRESHOLD},
    AVERAGE: {label: 'average', minScore: 0.5},
    FAIL: {label: 'fail'},
    ERROR: {label: 'error'},
};

export default class Util {

    /**
     * Prepare audits array.
     *
     * @param audits
     * @returns {any[]}
     */
    static prepareAudits(audits) {
        const clone = (JSON.parse(JSON.stringify(audits)));

        let result = [];
        for (const audit of Object.values(clone)) {
            if (audit.scoreDisplayMode === 'not_applicable' || audit.scoreDisplayMode === 'not-applicable') {
                continue;
            }

            if (audit.details) {
                if (audit.details.type === undefined || audit.details.type === 'diagnostic') {
                    audit.details.type = 'debugdata';
                }

                if (audit.details.type === 'filmstrip') {
                    for (const screenshot of audit.details.items) {
                        if (!screenshot.data.startsWith(SCREENSHOT_PREFIX)) {
                            screenshot.data = SCREENSHOT_PREFIX + screenshot.data;
                        }
                    }
                }
            }

            result.push(audit);
        }

        return result;
    }

    /**
     * Show as passed.
     *
     * @param audit
     * @returns {boolean}
     */
    static showAsPassed(audit) {
        switch (audit.scoreDisplayMode) {
            case 'manual':
            case 'notApplicable':
                return true;
            case 'error':
            case 'informative':
                return false;
            case 'numeric':
            case 'binary':
            default:
                return Number(audit.score) >= RATINGS.PASS.minScore;
        }
    }

    /**
     * Get wasted ms.
     *
     * @param audit
     * @returns {number|*}
     */
    static _getWastedMs(audit) {
        if (audit.details && audit.details.type === 'opportunity') {
            let details = audit.details;
            if (typeof details.overallSavingsMs !== 'number') {
                throw new Error('non-opportunity details passed to _getWastedMs');
            }
            return details.overallSavingsMs;
        } else {
            return Number.MIN_VALUE;
        }
    }
}
