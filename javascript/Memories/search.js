var Search = {
	
	noResultsList: [],
	
	noResults: function(type) {
		this.noResultsList.push(type);
		//$('#search'+ type).hide();
	},
	
	checkSearch: function() {
		if (this.noResultsList.length == 2) {
			//$('#search-results').html('<div id="search-no-results">Sorry! No results found.</div>');
		}
	}
};
