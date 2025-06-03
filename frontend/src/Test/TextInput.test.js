import { render, screen } from '../../src/redux/constants/tets-utils';
import BaseInput from '../components/BaseInput/BaseInput';
// import { render , fireEvent } from '@testing-library/react';
test('renders TextInput with placeholder', () => {
    render(<BaseInput placeholder="Enter text" />);

    const inputElement = screen.getByPlaceholderText('Enter text');
    expect(inputElement).toBeInTheDocument();
});

test('renders TextInput with initial value', () => {
    render(<BaseInput value="Initial Value" placeholder="Enter text" />);

    const inputElement = screen.getByTestId('text-input');
    expect(inputElement).toHaveValue('Initial Value');
});

test('calls onChange handler when input value changes', () => {
    const onChange = jest.fn();
    render(<BaseInput value="" onChange={onChange} placeholder="Enter text" />);

    const inputElement = screen.getByTestId('text-input');

    fireEvent.change(inputElement, { target: { value: 'New Value' } });

    expect(onChange).toHaveBeenCalledWith('New Value');
});