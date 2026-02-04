const getDisplayStyle = ( className = '' ) => {
	if ( typeof className !== 'string' ) {
		return 'default';
	}

	const styleMatch = className.match( /is-style-([a-z-]+)/ );
	return styleMatch ? styleMatch[ 1 ] : 'default';
};

export default getDisplayStyle;
