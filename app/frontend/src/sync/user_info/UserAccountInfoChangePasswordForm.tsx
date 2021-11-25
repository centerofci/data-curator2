import { FunctionalComponent, h } from "preact"
import { useState } from "preact/hooks"
import { connect, ConnectedProps } from "react-redux"
import { Box, Button, FormControl, FormGroup, makeStyles, TextField } from "@material-ui/core"

import "../common.scss"
import { ACTIONS } from "../../state/actions"
import type { RootState } from "../../state/State"
import { get_supabase } from "../../supabase/get_supabase"
import { DisplaySupabaseSessionError } from "./DisplaySupabaseErrors"


interface OwnProps {
    on_close: () => void
}


const map_state = (state: RootState) =>
{
    return {
        user: state.user_info.user,
        need_to_handle_password_recovery: state.user_info.need_to_handle_password_recovery,
    }
}

const map_dispatch = {
    set_user: ACTIONS.user_info.set_user,
    set_need_to_handle_password_recovery: ACTIONS.user_info.set_need_to_handle_password_recovery,
}


const connector = connect(map_state, map_dispatch)
type Props = ConnectedProps<typeof connector> & OwnProps




function _UserAccountInfoChangePasswordForm (props: Props)
{
    const { on_close, user, need_to_handle_password_recovery, set_user, set_need_to_handle_password_recovery } = props

    const [password, set_password] = useState("")
    const [supabase_session_error, set_supabase_session_error] = useState<Error | null>(null)

    if (!user) return null


    async function update_password ()
    {
        const supabase = get_supabase()

        // There should always be an email and password given on password update
        const email = user?.email
        const result = await supabase.auth.update({ email, password, /* data: {} */ })
        set_supabase_session_error(result.error)

        if (!result.error)
        {
            set_user({ user: result.user || undefined })
            set_need_to_handle_password_recovery(false)
            on_close()
        }
    }
    const classes = use_styles();
    return <FormGroup className="section">
        {need_to_handle_password_recovery && <p>Please set a new password.</p>}

        <Box className={classes.root}>
            <FormControl>
                <TextField
                    inputProps={{
                        type: "password",
                    }}
                    onBlur={(e:any) => set_password(e.currentTarget.value)}
                    onChange={(e:any) => set_password(e.currentTarget.value)}
                    onKeyUp={(e:any) => set_password(e.currentTarget.value)}
                    label="password"
                    size="small"
                    value={password}
                    variant="outlined"
                />
            </FormControl>

            <Box className={classes.update_button_container}>
                <Button
                    className={classes.update_button}
                    disabled={!(user?.email) || !password}
                    onClick={update_password}
                    variant="contained"
                >
                    Update password
                </Button>
            </Box>

            <Box>
            {!need_to_handle_password_recovery && <Button
                variant="contained"
                onClick={() =>
                {
                    on_close()
                    set_supabase_session_error(null)
                }}>
                    Cancel
                </Button>
            }
            </Box>
        </Box>

        <DisplaySupabaseSessionError error={supabase_session_error} />
    </FormGroup>
}

const use_styles = makeStyles(theme => ({
    root: {
        display:"flex",
        justifyContent: "flex-start", alignContent: "center",
    },
    update_button_container: {
        flexGrow: 1,
        textAlign: "left",
        marginLeft: 15,
    },
    update_button: {
        borderTopLeftRadius: 0,
        borderBottomLeftRadius:0,
    },
}))

export const UserAccountInfoChangePasswordForm = connector(_UserAccountInfoChangePasswordForm) as FunctionalComponent<OwnProps>
