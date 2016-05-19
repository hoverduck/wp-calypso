/**
 * External dependencies
 */
import React from 'react';
import noop from 'lodash/noop';

/**
 * Internal dependencies
 */
import Dialog from 'components/dialog';
import FormButton from 'components/forms/form-button';
import i18n from 'lib/mixins/i18n';

class VerifyEmailDialog extends React.Component {
	constructor( props ) {
		super( props );

		this.state = {
			pendingRequest: false,
			emailSent: false,
			error: false
		};

		this.handleSendVerification = this.sendVerification.bind( this );
	}

	sendVerification( e ) {
		e.preventDefault();

		if ( this.state.pendingRequest ) {
			return;
		}

		this.setState( { pendingRequest: true } );

		this.props.user.sendVerificationEmail( function( error, response ) {
			this.setState( {
				emailSent: response && response.success,
				error: error,
				pendingRequest: false
			} );
		}.bind( this ) );
	}

	getDialogButtons() {
		return [
			<FormButton
				key="close"
				isPrimary={ true }
				onClick={ this.props.onClose }>
					{ i18n.translate( 'Got It' ) }
			</FormButton>
		];
	}

	render() {
		const strings = {
			urgeToVerify: i18n.translate( 'Please verify your email address.' ),
			validationReason: i18n.translate( 'To prevent Spam, and to enable recovery if you ever forget your password, we require you to verify your email addresses before you can publish content.' ),
			validationEmailSent: i18n.translate(
				'You should have received an email at {{strong}}%(email)s{{/strong}} when you registered, with a link to validate your email address. If you can\'t find the email, just {{sendAgain}}click here to send it again{{/sendAgain}}.',
				{
					components: {
						strong: <strong />,
						sendAgain: <a href="#" onClick={ this.handleSendVerification } />
					},
					args: {
						email: this.props.user.data.email
					}
				}
			),
			userEmailWrong: i18n.translate(
				'If the email address above is wrong, {{emailPreferences}}click here to change it{{/emailPreferences}} in your preferences.',
				{
					components: {
						emailPreferences: <a href="/me/account" />
					}
				}
			)
		};

		return (
			<Dialog
				isVisible={ true }
				buttons={ this.getDialogButtons() }
				additionalClassNames="verification-modal"
			>
				<h1>
					{ strings.urgeToVerify }
				</h1>
				<p>{ strings.validationReason }</p>
				<p>{ strings.validationEmailSent }</p>
				<p>{ strings.userEmailWrong }</p>
			</Dialog>
		);
	}
}

VerifyEmailDialog.propTypes = {
	user: React.PropTypes.object.isRequired,
	onClose: React.PropTypes.func,
	onTryAgain: React.PropTypes.func
};

VerifyEmailDialog.defaultProps = {
	onClose: noop,
	onTryAgain: noop
};

export default VerifyEmailDialog;