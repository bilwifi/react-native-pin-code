import { TextStyle, ViewStyle } from "react-native";

export namespace PinCodeT {
    export interface PinCodeT {
        visible: boolean;
        mode: Modes;
        options?: Options;
        textOptions?: TextOptions,
        styles?: {
            main?: ViewStyle | ViewStyle[],
            enter?: {
                titleContainer?: ViewStyle | ViewStyle[];
                title?: TextStyle | TextStyle[];
                subTitle?: TextStyle | TextStyle[];
                pinContainer?: ViewStyle | ViewStyle[];
                buttonContainer?: ViewStyle | ViewStyle[];
                buttons?: ViewStyle | ViewStyle[];
                buttonText?: TextStyle | TextStyle[];
                footer?: ViewStyle | ViewStyle[];
                footerText?: TextStyle | TextStyle[];
            },
            locked?: {
                titleContainer?: ViewStyle | ViewStyle[];
                title?: TextStyle | TextStyle[];
                subTitle?: TextStyle | TextStyle[];
                clockContainer?: ViewStyle | ViewStyle[];
                clockText?: TextStyle | TextStyle[];
                locked?: TextStyle | TextStyle[];
            },
            reset?: {
                titleContainer?: ViewStyle | ViewStyle[];
                title?: TextStyle | TextStyle[];
                subTitle?: TextStyle | TextStyle[];
                buttons?: TextStyle | TextStyle[];
            }
        }
        onEnterSuccess: (pin?: string) => void;
        onSetSuccess: (pin?: string) => void;
        onSetCancel?: () => void;
        onResetSuccess: () => void;
        onModeChanged?: (mode?: Modes) => void;
        onStatusChanged?: (mode?: Modes, status?: Statuses) => void;
    }

    export enum Modes {
        Enter = 'enter',
        Set = 'set',
        Locked = 'locked',
        Reset = 'reset'
    }

    export enum Statuses {
        Initial = 'initial',
        EnterFailed = 'enter.failed',
        EnterSucceeded = 'enter.succeeded',

        SetOnce = 'set.once',
        SetFailed = 'set.failed',
        SetSucceeded = 'set.succeeded',

        ResetPrompted = 'reset.prompted',
        ResetSucceeded = 'reset.succeeded'
    }



    export interface Options {
        disableLock?: boolean;
        lockDuration?: number;
        maxAttemp?: number;
        allowReset?: boolean;
        backSpace?: JSX.Element;
        lockIcon?: JSX.Element;
    }

    export interface TextOptions {
        enter?: {
            title?: string;
            subTitle?: string;
            error?: string;
            backSpace?: string;
        },
        set?: {
            title?: string;
            subTitle?: string;
            repeat?: string;
            error?: string;
        },
        locked?: {
            title?: string;
            subTitle?: string;
            lockedText?: string;
        },
        reset?: {
            title?: string;
            subTitle?: string;
            confirm?: string;
        }
    }

    export const DEFAULT = {
        Options: {
            allowReset: true,
            disableLock: false,
            lockedDuration: 600000,
            maxAttempt: 4
        },
        TextOptions: {
            enter: {
                title: 'Enter PIN',
                subTitle: 'Enter 4-digit PIN to access.',
                error: 'Wrong PIN! Try again.',
                backSpace: 'Delete'
            },
            set: {
                title: 'Set up a new PIN',
                subTitle: 'Enter 4 digits.',
                repeat: 'Enter new PIN again.',
                error: `PIN don't match. Start the process again.`,
            },
            locked: {
                title: 'Locked',
                subTitle: `Your have entered wrong PIN many times.\nThe app is temporarily locked.`,
                lockedText: 'Locked',
            },
            reset: {
                title: 'Forgot PIN?',
                subTitle: `Remove the PIN may wipe out the app data and settings.`,
                confirm: 'Are you sure you want remove the PIN?'
            }
        }
    }
}