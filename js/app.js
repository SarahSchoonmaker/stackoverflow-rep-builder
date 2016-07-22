// this function takes the question object returned by the StackOverflow request
// and returns new result to be appended to DOM
var showQuestion = function(question) {
	
	// clone our result template code
	var result = $('.templates .question').clone();
	
	// Set the question properties in result
	var questionElem = result.find('.question-text a');
	questionElem.attr('href', question.link);
	questionElem.text(question.title);

	// set the date asked property in result
	var asked = result.find('.asked-date');
	var date = new Date(1000*question.creation_date);
	asked.text(date.toString());

	// set the viewed for question property in result
	var viewed = result.find('.viewed');
	viewed.text(question.view_count);

	// set some properties related to asker
	var asker = result.find('.asker');
	asker.html('<p>Name: <a target="_blank" '+
		'href=http://stackoverflow.com/users/' + question.owner.user_id + ' >' +
		question.owner.display_name +
		'</a></p>' +
		'<p>Reputation: ' + question.owner.reputation + '</p>'
	);

	return result;
};

var showAnswerer = function(answerer){
	var result = $('.templates .people').clone();
	var peopleText = result.find('.people-text a');
	peopleText.attr('href', answerer.user.link);
	peopleText.text(answerer.user.display_name);
	var image = "<img src='" + answerer.user.profile_image + "' alt='" + answerer.user.display_name + "'>";
    $(peopleText).append(image);
	


	return result;
}

// this function takes the results object from StackOverflow
// and returns the number of results and tags to be appended to DOM
var showSearchResults = function(query, resultNum) {
	var results = resultNum + ' results for <strong>' + query + '</strong>';
	return results;
};

// takes error string and turns it into displayable DOM element
var showError = function(error){
	var errorElem = $('.templates .error').clone();
	var errorText = '<p>' + error + '</p>';
	errorElem.append(errorText);
	return errorElem;
};

// takes a string of semi-colon separated tags to be searched
// for on StackOverflow
var getUnanswered = function(tags) {
	
	// the parameters we need to pass in our request to StackOverflow's API
	var request = { 
		tagged: tags,
		site: 'stackoverflow',
		order: 'desc',
		sort: 'creation'
	};
	
	$.ajax({
		url: "http://api.stackexchange.com/2.2/questions/unanswered",
		data: request,
		dataType: "json",//use jsonp to avoid cross origin issues
		type: "GET",
	})
	.done(function(result){ //this waits for the ajax to return with a succesful promise object
		var searchResults = showSearchResults(request.tagged, result.items.length);

		$('.search-results').html(searchResults);
		//$.each is a higher order function. It takes an array and a function as an argument.
		//The function is executed once for each item in the array.
		$.each(result.items, function(i, item) {
			var question = showQuestion(item);
			$('.results').append(question);
		});
	})
	.fail(function(jqXHR, error, errorThrown){ //this waits for the ajax to return with an error promise object
		var errorElem = showError(errorThrown);
		console.log(errorThrown);
		$('.search-results').append(errorElem);
	});
};


// this function takes the results object from StackOverflow
// and creates info about search results to be appended to DOM
var showSearchResults = function(query, resultNum) {
	var results = resultNum + ' results for <strong>' + query;
	return results;
};

// takes error string and turns it into displayable DOM element
var showError = function(error){
	var errorElem = $('.templates .error').clone();
	var errorText = '<p>' + error + '</p>';
	errorElem.append(errorText);
};


//Get top Answerers


var getInspiration = function(query) {

	// the parameters we need to pass in our request to StackOverflow's API
	var request = { 
		site: 'stackoverflow'
	};

	$.ajax({
		url: "http://api.stackexchange.com/2.2/tags/" + query + "/top-answerers/all_time",
		data: request,
		dataType: "json",
		type: "GET"
	})

	.done(function(result){ 
		var searchResults = showSearchResults(query, result.items.length);

		$('.search-results').html(searchResults);
		
		$.each(result.items, function(i, item) {
			var person = showAnswerer(item);
			$('.results').append(person);
		});
	})
	.fail(function(jqXHR, error){ 
		var errorElem = showError(error);
		$('.search-results').append(errorElem);
	});
};

	$('.unanswered-getter').submit( function(e){
		e.preventDefault();
		$('.results').html('');
		var tags = $(this).find("input[name='tags']").val();
		getUnanswered(tags);
	});

	$('.inspiration-getter').submit( function(e) {
		e.preventDefault();
		
		$('.results').html('');
		
		var answerers = $(this).find("input[name='answerers']").val();
		getInspiration(answerers);
	});
