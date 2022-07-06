import React, { Component } from 'react';
import { Api, TelegramClient } from 'telegram';
import { StringSession } from 'telegram/sessions';
import { SearchForm } from './components/SearchForm/SearchForm';
import { AdminsList } from './components/AdminsList/AdminsList';
import { Credentials } from './components/Credentials/Credentials';
import './App.css';

const STORAGE_NAME = {
    botToken: '_hvtgb-bt',
    apiId: '_hvtgb-ai',
    apiHash: '_hvtgb-ah',
    adminsList: '_hvtgb-al',
    searchInputValue: '_hvtgb-si',
};

export class App extends Component {
    constructor( props ) {
        super( props );

        this.state = {
            botToken: localStorage.getItem( STORAGE_NAME.botToken ) || '',
            apiId: parseInt( localStorage.getItem( STORAGE_NAME.apiId ) ) || 0,
            apiHash: localStorage.getItem( STORAGE_NAME.apiHash ) || '',
            botTokenInputValue: '',
            apiIdInputValue: '',
            apiHashInputValue: '',
            adminsList: JSON.parse( localStorage.getItem( STORAGE_NAME.adminsList ) ) || [],
            searchInputValue: localStorage.getItem( STORAGE_NAME.searchInputValue ) || '',
            searchMatchedGroupName: '',
            fetching: false,
            sessionForceLaunch: false,
        };

        this.stringSession = '';
        this.client = null;
    }

    async componentDidMount() {
        if ( this.areCredentialsValid() ) {
            await this.launchSession();
        }
    }

    async componentDidUpdate() {
        if ( this.state.sessionForceLaunch && ! this.state.fetching ) {
            await this.launchSession();
        }
    }

    // componentWillUnmount() {
        
    // }

    areCredentialsValid() {
        const {
            botToken,
            apiId,
            apiHash,
        } = this.state;

        return botToken && apiId && apiHash;
    }

    async launchSession() {
        this.setFetchingState( {
            fetching: true,
        } );

        try {
            const {
                botToken,
                apiId,
                apiHash,
            } = this.state;

            /* @link: https://gram.js.org/getting-started/authorization */

            this.client = new TelegramClient(
                new StringSession( this.stringSession ),
                apiId,
                apiHash,
                { connectionRetries: 5 }
            );

            await this.client.start( {
                botAuthToken: botToken,
            } );

            this.stringSession = this.client.session.save();

            this.setState( {
                searchMatchedGroupName: this.getSearchGroupName( this.state.searchInputValue ),
                sessionForceLaunch: false,
            } );
            this.setFetchingState( {
                fetching: false,
            } );
            // console.log( this.stringSession );
        }
        catch ( error ) {
            this.setFetchingState( {
                fetching: false,
            } );
            alert( 'Error: Failed to launch session. Try to reload the page, or enter other credentials.' );
        }
    };

    async resetCredentials() {
        this.setFetchingState( {
            fetching: true,
        } );

        try {
            await this.client.disconnect();

            this.stringSession = '';
            this.client = null;

            localStorage.removeItem( STORAGE_NAME.botToken );
            localStorage.removeItem( STORAGE_NAME.apiId );
            localStorage.removeItem( STORAGE_NAME.apiHash );

            this.setState( {
                botToken: '',
                apiId: 0,
                apiHash: '',
                adminsList: [],
                searchInputValue: '',
                searchMatchedGroupName: '',
            } );
            this.setFetchingState( {
                fetching: false,
            } );
        }
        catch ( error ) {
            this.setFetchingState( {
                fetching: false,
            } );
            alert( 'Error: Failed to end current session. Please, try again.' );
        }
    }

    setFetchingState( { fetching } ) {
        this.setState( {
            fetching,
        } );
    }

    handleInputChange( event ) {
        const {
            id,
            value,
            inputMode,
        } = event.target;

        this.setState( {
            [ `${ id }Value` ]: ( inputMode === 'numeric' )
                ? value.replace( /\D/g, '' )
                : value,
        } );
    }

    handleSearchInputChange( event ) {
        const { value } = event.target;

        this.setState( {
            searchInputValue: value,
            searchMatchedGroupName: this.getSearchGroupName( value ),
        } );
    }

    getSearchGroupName( value ) {
        const match = /.*webk\.telegram.*@(?<webClient>.+)$|.*t.me\/(?<shortLink>.+)$|^@(?<userName>.+)$/.exec( value );

        return match
            ? ( match.groups.webClient || match.groups.shortLink || match.groups.userName )
            : '';
    }

    async handleSearchFormSubmit( event ) {
        event.preventDefault();

        this.setFetchingState( {
            fetching: true,
        } );

        try {
            /* @link: https://gram.js.org/tl/channels/GetFullChannel */

            await this.client.connect();

            const response = await this.client.invoke(
                new Api.channels.GetParticipants( {
                    channel: this.state.searchMatchedGroupName,
                    filter: new Api.ChannelParticipantsAdmins(),
                    offset: 0,
                    limit: 100,
                    hash: 0,
                } )
            );
            let adminsList = response.participants.map( ( { userId, rank } ) => ( {
                id: userId.value.toString(),
                rank,
            } ) );

            adminsList = adminsList.map( ( { id, rank } ) => {
                const userDetails = response.users.find( user => user.id.value.toString() === id );
                const { bot, firstName, lastName, username } = userDetails;

                return {
                    id,
                    bot,
                    firstName,
                    lastName,
                    rank,
                    username,
                };
            } );

            localStorage.setItem( STORAGE_NAME.adminsList, JSON.stringify( adminsList ) );
            localStorage.setItem( STORAGE_NAME.searchInputValue, this.state.searchInputValue );

            this.setState( {
                adminsList,
            } );
            this.setFetchingState( {
                fetching: false,
            } );
            // console.log( adminsList );
        }
        catch ( error ) {
            this.setFetchingState( {
                fetching: false,
            } );
            alert( error );
        }
    }

    async handleCredentialsFormSubmit( event ) {
        event.preventDefault();

        this.setState( prevState => {
            const {
                botTokenInputValue,
                apiIdInputValue,
                apiHashInputValue,
                botToken,
                apiId,
                apiHash,
            } = prevState;

            if ( botTokenInputValue && parseInt( apiIdInputValue ) && apiHashInputValue ) {
                localStorage.setItem( STORAGE_NAME.botToken, botTokenInputValue );
                localStorage.setItem( STORAGE_NAME.apiId, apiIdInputValue );
                localStorage.setItem( STORAGE_NAME.apiHash, apiHashInputValue );

                return {
                    botTokenInputValue: '',
                    apiIdInputValue: '',
                    apiHashInputValue: '',
                    botToken: botTokenInputValue,
                    apiId: parseInt( apiIdInputValue ),
                    apiHash: apiHashInputValue,
                    sessionForceLaunch: true,
                };
            }

            return {
                botToken,
                apiId,
                apiHash,
            };
        } );
    }

    handleCopyAdminsToClipboard() {
        const notBotsAdminsList = this.state.adminsList
            .filter( ( { bot } ) => ! bot )
            .map( ( { username } ) => `@${ username }` );
        const copyText = notBotsAdminsList.join( '\n' );

        navigator.clipboard.writeText( copyText ).then( () => {
            alert( 'Copied to clipboard' );
        } );
    }

    render() {
        const {
            botTokenInputValue,
            apiIdInputValue,
            apiHashInputValue,
            searchInputValue,
            searchMatchedGroupName,
            adminsList,
            fetching,
        } = this.state;

        return (
            <main className='pageContent'>
                { this.areCredentialsValid.apply( this )
                    ? <>
                        <SearchForm
                            isFetching={ fetching }
                            formSubmitHandler={ this.handleSearchFormSubmit.bind( this ) }
                            inputValue={ searchInputValue }
                            isValidInput={ searchMatchedGroupName !== '' }
                            inputChangeHandler={ this.handleSearchInputChange.bind( this ) }
                            resetCredentialsHandler={ this.resetCredentials.bind( this ) }
                        />
                        { adminsList.length > 0 && <AdminsList
                            adminsList={ adminsList }
                            copyToClipboardHandler={ this.handleCopyAdminsToClipboard.bind( this ) }
                        /> }
                    </>
                    : <Credentials
                        botTokenInputValue={ botTokenInputValue }
                        apiIdInputValue={ apiIdInputValue }
                        apiHashInputValue={ apiHashInputValue }
                        inputChangeHandler={ this.handleInputChange.bind( this ) }
                        submitHandler={ this.handleCredentialsFormSubmit.bind( this ) }
                    />
                }
            </main>
        );
    }
}
