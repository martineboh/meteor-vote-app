//
// Utility functions
var VoteApp = {

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

}

  //
  // Template methods
  Template.vote.isAdmin = function(){
	if(Meteor.user()){
		return Meteor.user().isAdmin;
	}
  };

  Template.vote.activeUsers = function(){
	if( Meteor.user() ){
		var returnArr = [];

		Meteor.users.find().forEach(function(user){
			var nameArr = user.profile.name.split(' ');
			returnArr.push( {name : nameArr[0] + ' ' + nameArr[1].substr(0, 1) } );
		});

		return returnArr;
	}
  };

  Template.vote.nominees = function(){
	return Nominees.find({}, {sort : [['votes', 'desc']]});
  };

  Template.vote.title = function(){
	  var setting = Settings.findOne({name : 'title'});

	  if(setting){
		  return setting.value;
	  }	else {
		  return 'Vote on...';
	  }
  };

  Template.vote.votesPerUser = function(){
	  var setting = Settings.findOne({name : 'votesPerUser'});

	  if(setting){
		  return setting.value;
	  }	else {
		  return 5;
	  }

  };

  Template.vote.userVotes = function(){
	  return Meteor.user().votes;
  };

  Template.vote.canVote = function(){
  	if(Session.get("meteor_loggedin")){
		return Meteor.user().votes > 0;
	} else {
		return false;
	}
  };

  Template.vote.canVoteUp = function(){
	  if(Session.get("meteor_loggedin")){
		  var user = Meteor.user(),
		  	  nomineeVotes = NomineeVotes.findOne({nominee : this._id, user : user._id});

		  if(user.votes > 0 ) return true;

	  	  if(nomineeVotes && nomineeVotes.votes < 0){
	  	  	console.log(this.name, nomineeVotes.votes)
		  	  return true;
	  	  } else {
		  	  return false;
	  	  }
  	  } else {
	  	  return false
  	  }
  };

  Template.vote.canVoteDown = function(){
	  if(Session.get("meteor_loggedin")){
		  var user = Meteor.user(),
		  	  nomineeVotes = NomineeVotes.findOne({nominee : this._id, user : user._id});

		   if(user.votes > 0 ) return true;

	  	  if(nomineeVotes && nomineeVotes.votes >=1){
		  	  return true;
	  	  } else {
		  	  return false;
	  	  }
	  } else {
		  return false;
	  }
  };


  Template.vote.userVotesForNominee = function(){
	  var str = '',
	  	  user = Meteor.user(),
	  	  nomineeVotes = NomineeVotes.findOne({nominee : this._id, user : user._id});

  	 if(!nomineeVotes){
	  	 return null;
  	 }

  	 var votesTotal = nomineeVotes.votes;


  	 for (var i = 0; i < Math.abs(votesTotal); ++i) {
  	 	if(votesTotal < 0){
	  	 	str += '<p class="up"><i class="fa fa-thumbs-o-down"></i></p>';
  	 	} else {
	  	 	str += '<p class="down"><i class="fa fa-thumbs-o-up"></i></p>';
  	 	}
  	 }

	  return new Handlebars.SafeString(str);
  };

  //
  // Template Events
  Template.vote.events({
    'submit #form': function (e) {
	    e.preventDefault();
	    var $input = $('#form input'),
	    	val = $input.val();
	    	
    	if(val){
		    var nomineeId = Nominees.insert({name : $input.val(), votes : 1}),
				nominee = {_id : nomineeId},
				user = Meteor.user();

			VoteApp.increaseNomineeVotes(nominee, user);
			$input.val('');
		}
    },

    'click #reset' : function(e){
		if(Meteor.user().isAdmin){
			var setting = Settings.findOne({name : 'votesPerUser'});

			Settings.update({_id : setting._id}, {$set : {value : parseInt($('#numbervotes').val(), 10) }});
			Meteor.call('reset');
		}
    },

    'click .vote-button' : function(e){
	    e.preventDefault();
		if(Meteor.user()){
		    var $btn = $(e.target),
		    	user = Meteor.user();

			if(e.target.tagName.toLowerCase !== 'button'){
				$btn = $btn.closest('button');
			}

		    if($btn.hasClass('down')){
			    VoteApp.voteDownNominee(this);
			    VoteApp.decreaseNomineeVotes(this, user);
			    change = -1;
		    } else {
			    VoteApp.voteUpNominee(this);
				VoteApp.increaseNomineeVotes(this, user);
		    }




	    }
    },

	'blur #title' : function(){
		if(Meteor.user().isAdmin){
			var $title = $('#title'),
				val = $title.text().trim(),
				setting = Settings.findOne({name : 'title'});

			if(setting){
				Settings.update({_id : setting._id}, {$set : {value : val}});
			} else {
				Settings.insert({name : 'title', value : val});
			}
		}
	}

  });

  //
  // Autorun functions
  Deps.autorun(function() {
    Meteor.subscribe('userData');
	Session.set("meteor_loggedin",!!Meteor.user());

    // Handle on Login
    if(Meteor.userId()){
    	 Meteor.call('checkUserAccess');
    	 console.log('Hello!');
	} else {
		console.log('Bye!');
	}

});

	//
	// Handlebars Helpers
	Handlebars.registerHelper('session',function(input){
	    return Session.get(input);
	});
