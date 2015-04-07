//
// Utility functions
VoteApp = {

	 voteUpNominee : function(nominee){
		Nominees.update({_id : nominee._id},{$set : {votes: (nominee.votes + 1)}});
	},

	voteDownNominee : function(nominee){
		Nominees.update({_id : nominee._id},{$set : {votes: (nominee.votes - 1)}});
	},

	removeUserVote : function(user){
		Meteor.call('removeUserVote');
	},

	addUserVote : function(user){
		Meteor.call('addUserVote');
	},

	decreaseNomineeVotes : function(nominee, user){
		var nomineeVotes = NomineeVotes.findOne({nominee : nominee._id, user : user._id});

		if(nomineeVotes){
			NomineeVotes.update({_id : nomineeVotes._id}, {$set : {votes : (nomineeVotes.votes  - 1 )}});
		} else {
			var id = NomineeVotes.insert({nominee : nominee._id, user: user._id, votes : -1});
			nomineeVotes = NomineeVotes.findOne({_id : id });
		}

		if(nomineeVotes.votes <= 0){
			VoteApp.removeUserVote();
		} else {
			VoteApp.addUserVote();
		}
	},

	increaseNomineeVotes : function(nominee, user){
			var nomineeVotes = NomineeVotes.findOne({nominee : nominee._id, user : user._id});

		if(nomineeVotes){
			NomineeVotes.update({_id : nomineeVotes._id}, {$set : {votes : (nomineeVotes.votes  + 1 )}})
		} else {
			var id = NomineeVotes.insert({nominee : nominee._id, user: user._id, votes : 1});
			nomineeVotes = NomineeVotes.findOne({_id : id });
		}

		if(nomineeVotes.votes >= 0){
			VoteApp.removeUserVote();
		} else {
			VoteApp.addUserVote();
		}
	}
};

//
// Autorun functions
Deps.autorun(function() {
		Meteor.subscribe('userData');
		Meteor.subscribe('allUserData');
		Session.set("meteor_loggedin",!!Meteor.user());

	// Handle on Login
	if(Meteor.userId()){
		Meteor.call('onLogin');
		console.log('Hello!');
	} else {
		console.log('Bye!');
	}

});


