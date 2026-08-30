export const selectDashboardSummary = (state) => state.dashboard.summary;

export const selectDashboardCharts = (state) => state.dashboard.charts;

export const selectDashboardCategoryReport = (state) => state.dashboard.categoryReport;

export const selectDashboardLoading = (state) => {
  return state.dashboard.loadingSummary || state.dashboard.loadingCharts;
};

export const selectDashboardCategoryReportLoading = (state) => {
  return state.dashboard.loadingCategoryReport;
};

export const selectDashboardError = (state) => state.dashboard.error;