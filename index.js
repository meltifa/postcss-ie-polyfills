const postcss = require('postcss');
const opacity = require('./lib/polyfill/opacity');
const rgbaToHex = require('./lib/polyfill/rgbatohex');

const reIeFilter = /^alpha\(|^progid:/i;

module.exports = postcss.plugin('iecss3', (options) => {
	options = options || {};
	return (css, result) => {
		opacity(css, result);
		rgbaToHex(css);
		const ieFilterSelector = [];
		css.walkRules(rule => {
			// 提取使用ie filter的样式声明
			const ieFilters = rule.nodes.filter(decl => decl.prop === 'filter' && reIeFilter.test(decl.value));
			// 合并多个ie filter声明
			const filterLen = ieFilters.length;
			if (filterLen > 1) {
				const filterValues = [];
				ieFilters.forEach(decl => {
					filterValues.push(decl.value);
					decl.remove();
				});
				rule.prepend({
					prop: 'filter',
					value: filterValues.join(' ')
				});
			}
			// 拿到使用iefilter的选择器
			if (filterLen) {
				ieFilterSelector.push(`:root ${rule.selector}`);
			}
		});
		// ie9+ 不使用filter以免和css3效果冲突
		if (ieFilterSelector.length) {
			css.append(`${ieFilterSelector.toString()}{filter:none}`)
		}
	}
});