function removeFalsyValues(obj: object) {
	return Object.fromEntries(
		Object.entries(obj).filter(
			([_, value]) =>
				value !== undefined && value !== null && !Number.isNaN(value)
		)
	);
}

export default removeFalsyValues;
