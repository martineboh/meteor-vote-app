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
