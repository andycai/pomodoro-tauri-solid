import { Palette } from '../icons/palette';
import { useAction } from '../store/store';
import OperactionButton from './OperationButton';
import RefreshButton from './RefreshButton';

function FootBar() {
  const [action] = useAction()

  return (
    <div class="flex flex-row items-end mt-2 px-1">
      <button class="flex flex-row justify-start basis-1/4" title="Change Theme" onClick={action.changeTheme}>
        <Palette />
      </button>
      <OperactionButton />
      <RefreshButton />
  </div>
  )
}

export default FootBar
