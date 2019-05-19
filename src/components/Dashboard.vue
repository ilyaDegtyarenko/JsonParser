<template>
    <v-container id="audits-wrapper"
                 fill-height>
        <v-flex class="my-5" v-show="!fetchingProcess">
            <v-layout v-for="(item, index) in auditsList"
                      :key="index"
                      justify-center
                      wrap>
                <v-flex align-self-center
                        xs12
                        md8
                        mb-5>
                    <v-hover>
                        <v-card slot-scope="{ hover }"
                                :class="`elevation-${hover ? 8 : 2}`"
                                class="mx-auto"
                                style="-ms-word-break: break-word; word-break: break-word;">

                            <v-card-title class="title grey lighten-3"
                                          v-t="item.name"/>

                            <v-expansion-panel expand>
                                <v-expansion-panel-content v-for="(audit, index) in auditCategories[item.key]"
                                                           :key="index">
                                    <template v-slot:header>
                                        <v-layout align-center
                                                  justify-space-between>
                                            <v-layout align-center>
                                                <i :class="['indicator', (item.name === 'passed-audits' ? '--red' : getColorByScore(audit.score, 'indicator'))]"></i>
                                                <span v-text="audit.title"></span>
                                            </v-layout>

                                            <v-layout v-if="item.name === 'opportunities'"
                                                      column
                                                      wrap
                                                      justify-start
                                                      class="ml-1 mr-1 mb-2"
                                                      style="min-width: 40%; max-width: 40%;">
                                                <span :class="getColorByScore(audit.score, 'text')">{{audit.score || 0}} s</span>

                                                <v-progress-linear class="ma-0"
                                                                   :color="getColorByScore(audit.score, 'progress')"
                                                                   :value="(audit.score || 0) * 100"/>
                                            </v-layout>

                                            <div v-else
                                                 :class="item.name === 'diagnostics' ? getColorByScore(audit.score, 'text') : 'red--text'"
                                                 v-text="audit.displayValue"></div>
                                        </v-layout>
                                    </template>

                                    <v-card>
                                        <v-card-text class="grey lighten-3"
                                                     v-text="audit.description"/>
                                    </v-card>
                                </v-expansion-panel-content>
                            </v-expansion-panel>
                        </v-card>
                    </v-hover>
                </v-flex>
            </v-layout>
        </v-flex>

        <v-layout v-if="fetchingProcess"
                  column
                  fill-height
                  align-center
                  justify-center>

            <span class="mb-2 subheading grey--text text--lighten-1"
                  v-t="'data-fetching'"></span>

            <v-progress-circular size="68"
                                 width="1"
                                 color="grey"
                                 indeterminate/>
        </v-layout>

        <v-snackbar v-model="snackbar"
                    color="#eee">

            <span class="grey--text text--darken-4"
                  v-text="fetchResultMessage"></span>

            <v-btn class="grey--text text--darken-2"
                   flat
                   v-t="'close'"
                   @click="snackbar = false">
            </v-btn>
        </v-snackbar>
    </v-container>
</template>

<script>
    import {mapState, mapGetters} from 'vuex';

    export default {
        name: 'Dashboard',
        data: () => ({
            snackbar: false,
            fetchingProcess: false,
            fetchResultMessage: null,
            auditsList: [
                {
                    name: 'opportunities',
                    key: 'opportunityAudits'
                },
                {
                    name: 'diagnostics',
                    key: 'diagnosticAudits'
                },
                {
                    name: 'passed-audits',
                    key: 'passedAudits'
                }
            ]
        }),
        computed: {
            ...mapState('PROCESS', {
                audits: state => state.audits
            }),
            ...mapGetters('PROCESS', {
                opportunityAudits: 'OPPORTUNITY_AUDITS',
                diagnosticAudits: 'DIAGNOSTIC_AUDITS',
                passedAudits: 'PASSED_AUDITS'
            }),
            auditCategories() {
                return {
                    opportunityAudits: this.opportunityAudits,
                    diagnosticAudits: this.diagnosticAudits,
                    passedAudits: this.passedAudits
                };
            }
        },
        methods: {
            fetchData() {
                this.fetchingProcess = true;

                this.$store.dispatch('PROCESS/FETCH_DATA')
                    .then(() => {
                        this.fetchingProcess = false;
                        this.fetchResultMessage = this.$t('messages.fetching-successful');
                    })
                    .catch(error => {
                        this.fetchingProcess = false;
                        this.fetchResultMessage = this.$t('messages.invalid-data-from-server');

                        if (error) {
                            throw new Error(error);
                        }
                    })
                    .finally(() => (this.snackbar = true));
            },
            getColorByScore(score, type) {
                let classes;

                if (type === 'indicator') {
                    classes = [
                        '--red',
                        '--amber',
                        '--green'
                    ];
                } else if (type === 'text') {
                    classes = [
                        'red--text',
                        'amber--text',
                        'green--text'
                    ];
                } else {
                    classes = [
                        'red',
                        'amber',
                        'green'
                    ];
                }

                return score < .45 ? classes[0] : (score < .70 ? classes[1] : (classes[2]));
            }
        },
        mounted() {
            this.fetchData();
        }
    }
</script>

<style lang="scss" scoped>
    #audits-wrapper {
        i.indicator {
            min-width: 15px;
            min-height: 15px;
            margin-right: 10px;
            border: 2px solid transparent;
            background: transparent;
            -webkit-border-radius: 4px;
            -moz-border-radius: 4px;
            border-radius: 4px;

            &.--red {
                background: rgb(252, 199, 195);
                border-color: rgba(203, 2, 0, .4);
            }

            &.--amber {
                background: rgb(255, 237, 181);
                border-color: rgb(255, 193, 7);
            }

            &.--green {
                background: rgb(201, 231, 203);
                border-color: rgb(76, 175, 80);
            }
        }
    }
</style>
