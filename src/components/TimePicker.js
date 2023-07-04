import 'date-fns';
import React, {useEffect} from 'react';
import Grid from '@material-ui/core/Grid';
import DateFnsUtils from '@date-io/date-fns';
import {
    MuiPickersUtilsProvider,
    KeyboardTimePicker,
    KeyboardDatePicker,
} from '@material-ui/pickers';

export default function MaterialUIPickers(props) {
    const {open, label, value, setIsOpen, onTimePickerClose} = props;
    // const [selectedDate, setSelectedDate] = React.useState(props.value);

    const handleDateChange = (date) => {
        // setSelectedDate(date);
        onTimePickerClose(label, date)
    };

    return (
        <MuiPickersUtilsProvider utils={DateFnsUtils}>
            {/* <Grid container justify="space-around">
                <KeyboardDatePicker
                    disableToolbar
                    variant="inline"
                    format="MM/dd/yyyy"
                    margin="normal"
                    id="date-picker-inline"
                    label="Date picker inline"
                    value={selectedDate}
                    onChange={handleDateChange}
                    KeyboardButtonProps={{
                        'aria-label': 'change date',
                    }}
                />
                <KeyboardDatePicker
                    margin="normal"
                    id="date-picker-dialog"
                    label="Date picker dialog"
                    format="MM/dd/yyyy"
                    value={selectedDate}
                    onChange={handleDateChange}
                    KeyboardButtonProps={{
                        'aria-label': 'change date',
                    }}
                /> */}
                <KeyboardTimePicker
                    // open={open}
                    // onOpen={() => setIsOpen(true)}
                    // onClose={() => { onTimePickerClose(label, selectedDate) }}
                    margin="normal"
                    id="time-picker"
                    label={label}
                    value={value}
                    onChange={handleDateChange}
                    KeyboardButtonProps={{
                        'aria-label': 'change time',
                    }}
                />
            {/* </Grid> */}
        </MuiPickersUtilsProvider>
    );
}