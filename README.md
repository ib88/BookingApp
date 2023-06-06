# BookingApp
$ npm-install-all
npm run clean && npm run dist && npm run copy-files && npm run dev

Main color : #3D71E9

###############Alert############
You can use alert with this function : $('.alert').show();
And you have to send the right message to this tag : <span class="show-msg"></span>

Code de l'alert aà retravailler
		<!-- Display Alert -->
		<!-- Decomment these lines  when you will create alert-msg var -->
		<% if(alert-msg !='' ) { %> -->
			<div class="alert alert-danger alert-dismissible fade show" role="alert">
				<b>Warning</b> I display it after mockflight controller show flights propositions
				<span class="show-msg"><%= alert-msg %></span>
			</div>
		<!-- <% }) %>


