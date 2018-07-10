function heredoc(fn){
	return fn.toString()
	    .replace(/^[^\/]+\/\*!?\s?/,'')
	    .replace(/\*\/[^\/]+$/,'')
}
