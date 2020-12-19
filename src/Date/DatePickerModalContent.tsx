import * as React from 'react'

import Calendar, {
  BaseCalendarProps,
  CalendarDate,
  ExcludeInRangeChange,
  RangeChange,
  SingleChange,
} from './Calendar'

import AnimatedCrossView from './AnimatedCrossView'

import DatePickerModalHeader from './DatePickerModalHeader'
import DatePickerModalContentHeader, {
  HeaderPickProps,
} from './DatePickerModalContentHeader'
import CalendarEdit from './CalendarEdit'
import DatePickerModalHeaderBackground from './DatePickerModalHeaderBackground'

export type LocalState = {
  startDate: CalendarDate
  endDate: CalendarDate
  date: CalendarDate
  excludedDates: Date[]
}

interface DatePickerModalContentBaseProps {
  inputFormat?: string
  onDismiss: () => any
  disableSafeTop?: boolean
}

export interface DatePickerModalContentRangeProps
  extends HeaderPickProps,
    BaseCalendarProps,
    DatePickerModalContentBaseProps {
  mode: 'range'
  startDate: Date | null | undefined
  endDate: Date | null | undefined
  onChange?: RangeChange
  onConfirm: RangeChange
}

export interface DatePickerModalContentSingleProps
  extends HeaderPickProps,
    BaseCalendarProps,
    DatePickerModalContentBaseProps {
  mode: 'single'
  date?: Date | null | undefined
  onChange?: SingleChange
  onConfirm: SingleChange
}

export interface DatePickerModalContentExcludeInRangeProps
  extends HeaderPickProps,
    BaseCalendarProps,
    DatePickerModalContentBaseProps {
  mode: 'excludeInRange'
  startDate: Date
  endDate: Date
  excludedDates: Date[] | undefined
  onChange?: ExcludeInRangeChange
  onConfirm: ExcludeInRangeChange
}

export function DatePickerModalContent(
  props:
    | DatePickerModalContentRangeProps
    | DatePickerModalContentSingleProps
    | DatePickerModalContentExcludeInRangeProps
) {
  const {
    mode,
    onChange,
    onConfirm,
    onDismiss,
    disableSafeTop,
    disableWeekDays,
    locale,
  } = props

  const anyProps = props as any

  // use local state to add only onConfirm state changes
  const [state, setState] = React.useState<LocalState>({
    date: anyProps.date,
    startDate: anyProps.startDate,
    endDate: anyProps.endDate,
    excludedDates: anyProps.excludedDates,
  })

  // update local state if changed from outside or if modal is opened
  React.useEffect(() => {
    setState({
      date: anyProps.date,
      startDate: anyProps.startDate,
      endDate: anyProps.endDate,
      excludedDates: anyProps.excludedDates,
    })
  }, [
    anyProps.date,
    anyProps.startDate,
    anyProps.endDate,
    anyProps.excludedDates,
  ])

  const [collapsed, setCollapsed] = React.useState<boolean>(true)

  const onInnerChange = React.useCallback(
    (params) => {
      onChange && onChange(params)
      setState((prev) => ({ ...prev, ...params }))
    },
    [onChange, setState]
  )

  const onInnerConfirm = React.useCallback(() => {
    if (mode === 'single') {
      ;(onConfirm as DatePickerModalContentSingleProps['onConfirm'])({
        date: state.date,
      })
    } else if (mode === 'range') {
      ;(onConfirm as DatePickerModalContentRangeProps['onConfirm'])({
        startDate: state.startDate,
        endDate: state.endDate,
      })
    } else if (mode === 'excludeInRange') {
      ;(onConfirm as DatePickerModalContentExcludeInRangeProps['onConfirm'])({
        excludedDates: state.excludedDates,
      })
    }
  }, [state, mode, onConfirm])

  const onToggleCollapse = React.useCallback(() => {
    setCollapsed((prev) => !prev)
  }, [setCollapsed])

  return (
    <>
      <DatePickerModalHeaderBackground>
        <DatePickerModalHeader
          onSave={onInnerConfirm}
          onDismiss={onDismiss}
          saveLabel={props.saveLabel}
          disableSafeTop={disableSafeTop}
        />
        <DatePickerModalContentHeader
          state={state}
          mode={mode}
          collapsed={collapsed}
          onToggle={onToggleCollapse}
          headerSeparator={props.headerSeparator}
          emptyLabel={props.emptyLabel}
          label={props.label}
          startLabel={props.startLabel}
          endLabel={props.endLabel}
          locale={locale}
        />
      </DatePickerModalHeaderBackground>

      <AnimatedCrossView
        collapsed={collapsed}
        calendar={
          <Calendar
            locale={locale}
            mode={mode}
            startDate={state.startDate}
            endDate={state.endDate}
            date={state.date}
            excludedDates={state.excludedDates}
            onChange={onInnerChange}
            disableWeekDays={disableWeekDays}
          />
        }
        calendarEdit={
          <CalendarEdit
            mode={mode}
            state={state}
            label={props.label}
            startLabel={props.startLabel}
            endLabel={props.endLabel}
            collapsed={collapsed}
            onChange={onInnerChange}
          />
        }
      />
    </>
  )
}

export default React.memo(DatePickerModalContent)
