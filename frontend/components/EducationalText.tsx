import * as React from 'react';

const EducationalText = () => {
  return (
    <>
      <p>Look at that! A Hello World app! This greeting is stored on the NEAR blockchain. Check it out:</p>
      <ol>
        <li>
          Look in <code className="text-sm font-bold text-gray-900">frontend/components/ContractView.tsx</code> - you&apos;ll see <code className="text-sm font-bold text-gray-900">getGreeting</code> and <code className="text-sm font-bold text-gray-900">setGreeting</code> being
          called on <code className="text-sm font-bold text-gray-900">contract</code>. What&apos;s this?
        </li>
        <li>
          Ultimately, this <code className="text-sm font-bold text-gray-900">contract</code> code is defined in <code className="text-sm font-bold text-gray-900">./contract</code> – this is the source code
          for your{' '}
          <a target="_blank" rel="noreferrer" href="https://docs.near.org/docs/develop/contracts/overview">
            smart contract
          </a>
          .
        </li>
        <li>
          When you run <code className="text-sm font-bold text-gray-900">npm run deploy</code>, the code in <code className="text-sm font-bold text-gray-900">./contract</code> gets deployed to the NEAR
          testnet. You can see how this happens by looking in <code className="text-sm font-bold text-gray-900">package.json</code>.
        </li>
      </ol>
      <hr />
      <p>
        To keep learning, check out{' '}
        <a className="text-sky-500 hover:text-sky-600" target="_blank" rel="noreferrer" href="https://docs.near.org">
          the NEAR docs
        </a>{' '}
        or look through some{' '}
        <a className="text-sky-500 hover:text-sky-600" target="_blank" rel="noreferrer" href="https://examples.near.org">
          example apps
        </a>
        .
      </p>
    </>
  );
};

export default EducationalText;
