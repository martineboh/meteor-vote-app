
 //
 // Set up Twitter & Facebook Login on Startup
	Meteor.startup(function () {

		Accounts.loginServiceConfiguration.remove({
			service : 'facebook'
		});

		Accounts.loginServiceConfiguration.remove({
			service : 'twitter'
		});

		Accounts.loginServiceConfiguration.insert(Meteor.settings.facebookSettings);
		Accounts.loginServiceConfiguration.insert(Meteor.settings.twitterSettings);
	});

  	//
  	// Server Methods
	Meteor.methods({
		checkUserAccess: function() {
			var admins =  JSON.parse(Assets.getText('admins.json')),
				user = Meteor.user(),
				isAdmin = user.services.facebook ? admins.indexOf(user.services.facebook.id) > -1 : false,
				$set = {},
				voteSetting = Settings.findOne({name : 'votesPerUser'});

			if(!voteSetting){
				Settings.insert({name : 'votesPerUser', value : 5});
				voteSetting = Settings.findOne({name : 'votesPerUser'});
			}

			if(typeof user.votes == 'undefined'){
				$set.votes = voteSetting.value;
			}

			$set.isAdmin = isAdmin;
			Meteor.users.update({_id:Meteor.user()._id}, { $set: $set });
		},
		reset : function(){
			if(Meteor.user().isAdmin){
				// Remove Nominees
				Nominees.remove({});
				// Remove Nominee Votes
				NomineeVotes.remove({});
				// Reset Title
				Settings.remove({name: 'title'});
				// Reset user votes
				Meteor.users.update({}, { $set: {votes : Settings.findOne({name : 'votesPerUser'}).value }}, {multi: true});
			}
		},
		addUserVote : function(){
			var user = Meteor.user();
			Meteor.users.update({_id : user._id},{$set : {votes: (user.votes + 1)}});
		},
		removeUserVote : function(){
			var user = Meteor.user();
			Meteor.users.update({_id : user._id},{$set : {votes: (user.votes - 1)}});


		}
	});


	//
	// Publish custom user attributes
	Meteor.publish('userData', function() {
	  if(!this.userId) return null;
	  return Meteor.users.find(this.userId, {fields: {
	    isAdmin: 1,
	    votes : 1
	  }});
	});
