// Projects, tools, and communities ThariKey learned from or built on top of. Separate from
// sponsors — this is inspiration / prior art / references, rendered under the sponsors on About.
export interface Acknowledgement {
  name: string;
  url: string;
  note: string;
}

export const acknowledgements: Acknowledgement[] = [
  // Projects / prior art
  { name: 'Keyman', url: 'https://keyman.com', note: 'Input-method design, composition models, and the sponsorship/credits pattern.' },
  { name: 'RIME', url: 'https://rime.im', note: 'Reference for composition and reconciliation models.' },
  { name: 'SIL Global', url: 'https://www.sil.org', note: 'Thaana layout references and the Open Font License.' },
  { name: 'Ukelele', url: 'https://software.sil.org/ukelele/', note: 'Keyboard-layout study during the layout work.' },
  { name: 'Thaana-OSX', url: 'https://github.com/kudanai/Thaana-OSX', note: 'An earlier macOS Thaana input project.' },
  { name: 'Lipika', url: 'https://github.com/aupasana/Lipika_IME', note: 'Transliteration IME studied during engine design.' },
  { name: 'UniKey', url: 'https://www.unikey.org', note: 'Input-method engine studied during engine design.' },

  // Data & references
  { name: 'dhivehi-transliteration (politecat)', url: 'https://github.com/politecat314/dhivehi-transliteration', note: 'Dhivehi transliteration dataset.' },
  { name: 'alakxender', url: 'https://huggingface.co/alakxender', note: 'Dhivehi transliteration pairs dataset.' },
  { name: 'ISO 15919', url: 'https://www.iso.org/standard/28333.html', note: 'Romanization standard reference.' },
  { name: 'Omniglot', url: 'https://www.omniglot.com/writing/thaana.htm', note: 'Thaana script reference.' },
  { name: 'That Maldives Blog', url: 'https://thatmaldivesblog.com', note: 'Background and reference on Dhivehi and Thaana.' },
];
