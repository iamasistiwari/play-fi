/* eslint-disable import/no-anonymous-default-export */
/* eslint-disable react/display-name */
import { AlertDialog } from "radix-ui";

export default () => (
  <AlertDialog.Root>
    <AlertDialog.Trigger />
    <AlertDialog.Portal>
      <AlertDialog.Overlay />
      <AlertDialog.Content>
        <AlertDialog.Title />
        <AlertDialog.Description />
        <AlertDialog.Cancel />
        <AlertDialog.Action />
      </AlertDialog.Content>
    </AlertDialog.Portal>
  </AlertDialog.Root>
);
