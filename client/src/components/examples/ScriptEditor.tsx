import ScriptEditor from '../ScriptEditor';

export default function ScriptEditorExample() {
  return (
    <div className="h-[600px]">
      <ScriptEditor onGenerate={(script) => console.log('Generate video with script:', script)} />
    </div>
  );
}
