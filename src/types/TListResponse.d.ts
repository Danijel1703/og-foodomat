type TListResponse<TEntity> = {
	items: Array<TEntity>;
	page: number;
	rpp: number;
	totalRecords: number;
};
