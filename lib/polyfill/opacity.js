function opacity(css) {
	css.walkDecls('opacity', decl => {
		const value = decl.value;
		if (isNaN(value)) {
			return decl.warn(result, 'Unknown CSS opacity value: ' + value);
		}
		decl.cloneBefore({
			prop: 'filter',
			value: `alpha(opacity=${value * 100})`
		});
	});
}
module.exports = opacity;