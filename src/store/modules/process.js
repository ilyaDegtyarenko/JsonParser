import Vue from 'vue';
import axios from 'axios';
import Util from '../../util';

export default {
    namespaced: true,
    state: {
        audits: []
    },
    getters: {
        OPPORTUNITY_AUDITS: state => {
            if (!state.audits.length) return [];

            return state.audits
                        .filter(audit => !Util.showAsPassed(audit))
                        .sort((auditA, auditB) => Util._getWastedMs(auditB) - Util._getWastedMs(auditA));
        },
        DIAGNOSTIC_AUDITS: state => {
            if (!state.audits.length) return [];

            return state.audits
                        .filter(audit => audit.scoreDisplayMode === 'numeric' && !Util.showAsPassed(audit))
                        .sort((a, b) => {
                            const scoreA = a.scoreDisplayMode === 'informative' ? 100 : Number(a.score);
                            const scoreB = b.scoreDisplayMode === 'informative' ? 100 : Number(b.score);
                            return scoreA - scoreB;
                        });
        },
        PASSED_AUDITS: state => {
            if (!state.audits.length) return [];

            return state.audits
                        .filter(audit => Util.showAsPassed(audit))
                        .sort((auditA, auditB) => Util._getWastedMs(auditB) - Util._getWastedMs(auditA));
        }
    },
    mutations: {
        SET_STATE: (state, {key, value}) => Vue.set(state, key, value)
    },
    actions: {
        FETCH_DATA: ({commit}) => new Promise((resolve, reject) => {
            axios.get('https://www.googleapis.com/pagespeedonline/v5/runPagespeed/?url=https://habr.com/')
                 .then(response => {
                     let audits;

                     try {
                         audits = Util.prepareAudits(response.data.lighthouseResult.audits);
                     } catch (e) {
                         audits = [];
                         reject(e);
                     }

                     if (!Array.isArray(audits) || !audits.length) {
                         reject();
                     } else {
                         commit('SET_STATE', {
                             key: 'audits',
                             value: audits
                         });

                         resolve();
                     }
                 })
                 .catch(error => reject(error));
        })
    }
};

