/**
 * 参数错误异常
 */
class ArgumentError extends Error{
	constructor(message){
		super(message);
		this.name = 'ArgumentError';
	}
}

module.exports = ArgumentError;