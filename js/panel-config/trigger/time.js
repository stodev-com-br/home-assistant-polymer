import { h, Component } from 'preact';

import { onChangeEvent } from '../../common/util/event.js';

export default class TimeTrigger extends Component {
  constructor() {
    super();

    this.onChange = onChangeEvent.bind(this, 'trigger');
  }

  /* eslint-disable camelcase */
  render({ trigger, localize }) {
    const { at } = trigger;
    return (
      <div>
        <paper-input
          label={localize('ui.panel.config.automation.editor.triggers.type.time.at')}
          name="at"
          value={at}
          onvalue-changed={this.onChange}
        />
      </div>
    );
  }
}

TimeTrigger.defaultConfig = {
  at: '',
};
