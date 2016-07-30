/**
 * 日志工具类，方便以后做扩展，如日志收集
 * @type {Object}
 */
module.exports = {
	log : (msg) => {
		console.log(msg);
	},
	warn : (msg) => {
		console.warn(msg);
	},
	error : (msg) => {
		console.error(msg);
	}
};