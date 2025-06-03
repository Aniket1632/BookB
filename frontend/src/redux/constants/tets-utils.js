import { render } from '@testing-library/react';
import { BrowserRouter as Router } from 'react-router-dom';
import { Provider } from 'react-redux';
import store from '../store';

function ReduxProvider({ children }) {
    return (
        <Provider store={store}>
            <Router>{children}</Router>
        </Provider>
    );
}

const reduxRender = (ui, options) => render(ui, { wrapper: ReduxProvider, ...options });

export * from '@testing-library/react';
export { reduxRender as render };