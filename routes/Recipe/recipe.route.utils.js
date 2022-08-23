/**
 * Accepts a URL and returns a string representing the host 
 * 
 * "www.google.com" => "google" 
 * 
 * @param {string} url 
 * @returns {string | undefined}
 */
const getHostFromUrl = (url) => {
	const [ hostString ] = url.match(/(?<=\.)(.*?)(?=\.)/);
	return hostString;
}

const TargetSelectorsMap = Object.freeze({
	allrecipes: {
		targetParentClass: {
			ingredients: ".ingredients-section",
			steps: ".instructions-section",
		},
		targetDomElementClass: {
			ingredient: ".ingredients-item-name",
			step: ".paragraph > p"
		}
	}
});

/**
 *	Searches the TargetSelector Map and returns matching TargetSelector or undefined if the host does not have a corresponding entry in TargetSelector Map
 * @param {string} url 
 * @returns {TargetSelector | undefined}
 */
const getTargetSelectorFromUrl = (url) => {
	const hostName = getHostFromUrl(url);
	return TargetSelectorsMap[hostName];
}


module.exports.getHostFromUrl = getHostFromUrl;
module.exports.getTargetSelectorFromUrl = getTargetSelectorFromUrl;
module.exports.TargetSelectorsMap = TargetSelectorsMap;