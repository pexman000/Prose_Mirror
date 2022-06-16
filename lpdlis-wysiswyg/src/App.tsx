import { BoldExtension, ItalicExtension, UnderlineExtension } from 'remirror/extensions';
import { Remirror, useRemirror } from '@remirror/react';

function App() {

    const extensions = () => [new BoldExtension(), new ItalicExtension(), new UnderlineExtension()];

    const { manager, onChange, state } = useRemirror({
        extensions,
        content: '<p>Hi <strong>Friend</strong></p>',
        stringHandler: 'html',
        selection: 'end'
    });

    return (
      <div className="App">
          <Remirror onChange={onChange} manager={manager} initialContent={state} />
      </div>
  );
}

export default App;
