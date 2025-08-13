import { AiOutlineInfoCircle } from 'react-icons/ai'
import { FormattedMessage } from 'react-intl'

function NoResults() {
  return (
    <div className="flex flex-col items-center justify-center h-[calc(100vh-200px)] space-y-4 p-8 w-full">
    <div className="flex items-center justify-center w-16 h-16 rounded-full bg-gray-100">
      <AiOutlineInfoCircle className="w-8 h-8 text-gray-400" />
    </div>

    <div className="text-center space-y-2">
      <h3 className="text-lg font-semibold text-gray-700">
        <FormattedMessage id={"noResults"}></FormattedMessage>
      </h3>
    </div>
  </div>
  )
}

export default NoResults