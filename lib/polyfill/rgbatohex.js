const rgbHex = require('rgb-hex');

const reRGBA = /rgba\(\s*\d{1,3}\s*,\s*\d{1,3}\s*,\s*\d{1,3}\s*,\s*[\d\.]+\s*\)/ig;

function ieHex(rgb) {
	const hex = rgbHex(rgb);
	if (hex.length > 6) {
		const a = hex.substring(6);
		const rgb = hex.substring(0, 6);
		return a + rgb;
	}
	return hex;
}

function rgbToHex(css) {
	css.walkDecls(/^background(\-color)?/, decl => {
		const bgColor = decl.value.match(reRGBA);
		if (bgColor) {
			const ieHexStr = ieHex(bgColor.toString());
			decl.cloneBefore({
				prop: 'filter',
				value: `progid:DXImageTransform.Microsoft.gradient(startColorstr=${ieHexStr}, endColorstr=${ieHexStr})`
			});
		}
	})
}
module.exports = rgbToHex;