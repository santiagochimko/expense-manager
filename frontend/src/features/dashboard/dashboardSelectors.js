export const selectDashboardSummary = (state) => state.dashboard.summary;

export const selectDashboardCharts = (state) => state.dashboard.charts;

export const selectDashboardLoading = (state) => {
  return state.dashboard.loadingSummary || state.dashboard.loadingCharts;
};

export const selectDashboardError = (state) => state.dashboard.error;