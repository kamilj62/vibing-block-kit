import React from 'react';
import PropTypes from 'prop-types';

import { Header } from './Header';
import './page.css';

export const Page = ({
  user,
  onLogin = () => {},
  onLogout = () => {},
  onCreateAccount = () => {}
}) => {
  const DEFAULT_USER = React.useMemo(() => ({ name: 'Guest User' }), []);
  const [localUser, setLocalUser] = React.useState(user);
  
  // Use local state if no user is provided via props
  const currentUser = user !== undefined ? user : localUser;
  
  const handleLogin = React.useCallback((userData) => {
    const userToSet = userData || DEFAULT_USER;
    setLocalUser(userToSet);
    onLogin(userToSet);
  }, [DEFAULT_USER, onLogin]);
  
  const handleLogout = React.useCallback(() => {
    setLocalUser(undefined);
    onLogout();
  }, [onLogout]);
  
  const handleCreateAccount = React.useCallback((userData) => {
    const userToSet = userData || DEFAULT_USER;
    setLocalUser(userToSet);
    onCreateAccount(userToSet);
  }, [DEFAULT_USER, onCreateAccount]);
  
  // Set default user if no user is provided
  React.useEffect(() => {
    if (user === undefined && localUser === undefined) {
      handleLogin(DEFAULT_USER);
    }
  }, [user, localUser, handleLogin, DEFAULT_USER]);
  
  // Define prop types for better documentation and development experience
  Page.propTypes = {
    /** The current user object */
    user: PropTypes.shape({
      name: PropTypes.string,
      email: PropTypes.string,
      avatar: PropTypes.string
    }),
    /** Callback when user logs in */
    onLogin: PropTypes.func,
    /** Callback when user logs out */
    onLogout: PropTypes.func,
    /** Callback when a new account is created */
    onCreateAccount: PropTypes.func
  };

  // Set display name for better debugging
  Page.displayName = 'Page';

  return (
    <article>
      <Header
        user={currentUser}
        onLogin={handleLogin}
        onLogout={handleLogout}
        onCreateAccount={handleCreateAccount}
      />

      <section className="storybook-page">
        <h2>Pages in Storybook</h2>
        <p>
          We recommend building UIs with a{' '}
          <a href="https://componentdriven.org" target="_blank" rel="noopener noreferrer">
            <strong>component-driven</strong>
          </a>{' '}
          process starting with atomic components and ending with pages.
        </p>
        <p>
          Render pages with mock data. This makes it easy to build and review page states without
          needing to navigate to them in your app. Here are some handy patterns for managing page
          data in Storybook:
        </p>
        <ul>
          <li>
            Use a higher-level connected component. Storybook helps you compose such data from the
            &quot;args&quot; of child component stories
          </li>
          <li>
            Assemble data in the page component from your services. You can mock these services out
            using Storybook.
          </li>
        </ul>
        <p>
          Get a guided tutorial on component-driven development at{' '}
          <a href="https://storybook.js.org/tutorials/" target="_blank" rel="noopener noreferrer">
            Storybook tutorials
          </a>
          . Read more in the{' '}
          <a href="https://storybook.js.org/docs" target="_blank" rel="noopener noreferrer">
            docs
          </a>
          .
        </p>
        <div className="tip-wrapper">
          <span className="tip">Tip</span> Adjust the width of the canvas with the{' '}
          <svg width="10" height="10" viewBox="0 0 12 12" xmlns="http://www.w3.org/2000/svg">
            <g fill="none" fillRule="evenodd">
              <path
                d="M1.5 5.2h4.8c.3 0 .5.2.5.4v5.1c-.1.2-.3.3-.4.3H1.4a.5.5 0 01-.5-.4V5.7c0-.3.2-.5.5-.5zm0-2.1h6.9c.3 0 .5.2.5.4v7a.5.5 0 01-1 0V4H1.5a.5.5 0 010-1zm0-2.1h9c.3 0 .5.2.5.4v9.1a.5.5 0 01-1 0V2H1.5a.5.5 0 010-1zm4.3 5.2H2V10h3.8V6.2z"
                id="a"
                fill="#999"
              />
            </g>
          </svg>
          Viewports addon in the toolbar
        </div>
      </section>
    </article>
  );
};
