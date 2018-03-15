import React, { Component } from 'react';
import {
  withRouter,
  Redirect
} from 'react-router-dom';
import BitcoinCash from '../utilities/BitcoinCash'
import Bitcoin from 'bitcoinjs-lib';
import moment from 'moment';
import underscore from 'underscore';

class Transaction extends Component {
  constructor(props) {
    super(props);
    this.state = {
      redirect: false
    }
  }

  handleRedirect() {
    this.setState({
      redirect: true
    })
  }

  // componentDidMount() {
  //   let t = bitbox.BitcoinCash.transaction();
  //   let decodedTx = t.fromHex(this.state.transaction.rawHex);
  //   let a = bitbox.BitcoinCash.address();
  //   let s = bitbox.BitcoinCash.script();
  //   let ins = [];
  //   let ecpair = bitbox.BitcoinCash.ECPair();
  //   decodedTx.ins.forEach((input, index) => {
  //     let chunksIn = s.decompile(input.script);
  //     let inputPubKey = ecpair.fromPublicKeyBuffer(chunksIn[1], Bitcoin.networks[this.props.wallet.network]).getAddress();
  //     ins.push({
  //       inputPubKey: inputPubKey,
  //       hex: input.script.toString('hex'),
  //       script: s.toASM(chunksIn)
  //     });
  //   })
  //   this.setState({
  //     inputs: ins
  //   })
  //
  //   let outs = [];
  //   let value = 0;
  //   decodedTx.outs.forEach((output, index) => {
  //     value += output.value;
  //     let chunksIn = s.decompile(output.script);
  //     let outputPubKey = a.fromOutputScript(output.script, Bitcoin.networks[this.props.wallet.network]);
  //     outs.push({
  //       outputPubKey: outputPubKey,
  //       hex: output.script.toString('hex'),
  //       script: s.toASM(chunksIn)
  //     });
  //   })
  //   this.setState({
  //     outputs: outs
  //   })
  // }

  render() {
    let block = underscore.findWhere(this.props.blockchain.chain, {index: +this.props.match.params.block_id});
    let tx = underscore.findWhere(block.transactions, {hash: this.props.match.params.transaction_id});

    if (this.state.redirect) {
      return <Redirect
        push
        to={{
          pathname: `/blocks/${this.props.match.params.block_id}`
        }}
      />
    }

    let inputs = [];
    tx.inputs.forEach((input, index) => {
      if(this.props.configuration.wallet.displayCashaddr) {
        input.inputPubKey = bitbox.BitcoinCash.toCashAddress(input.inputPubKey);
      }
      inputs.push(
        <table className="pure-table tableFormatting" key={index}>
          <tbody>
            <tr>
              <td>{input.inputPubKey}</td>
            </tr>
            <tr>
              <td className='breakWord'>HEX<br /> {input.hex}</td>
            </tr>
            <tr>
              <td className='breakWord'>REDEEM SCRIPT<br /> {input.script}</td>
            </tr>
          </tbody>
        </table>
      );
    });

    let outputs = [];
    tx.outputs.forEach((output, index) => {
      if(this.props.configuration.wallet.displayCashaddr) {
        output.outputPubKey = bitbox.BitcoinCash.toCashAddress(output.outputPubKey);
      }
      outputs.push(
        <table className="pure-table tableFormatting" key={index}>
          <tbody>
            <tr>
              <td>{output.outputPubKey}</td>
            </tr>
            <tr>
              <td className='breakWord'>HEX<br /> {output.hex}</td>
            </tr>
            <tr>
              <td className='breakWord'>LOCK SCRIPT<br /> {output.script}</td>
            </tr>
          </tbody>
        </table>
      );
    });

    return (
      <div className="WrapperBlockDetails Transaction">
        <table className="pure-table DetailsHeader">
          <tbody>
            <tr className="">
              <td className='important nextPage' onClick={this.handleRedirect.bind(this)}><i className="fa fa-arrow-left" /> <span className='subheader'>BACK</span></td>
              <td className='important'>TRANSACTION {tx.hash}</td>
            </tr>
          </tbody>
        </table>
        <table className="pure-table tableFormatting">
          <tbody>
            <tr>
              <td colSpan="4" className='breakWord'><span className='subheader'>HEX</span> <br />{tx.rawHex}</td>
              <td className="label coinbase">COINBASE</td>
            </tr>
            <tr>
              <td>VALUE <br />{bitbox.BitcoinCash.toBitcoinCash(tx.value)} BCH</td>
              <td>DATE <br />{moment(tx.timestamp).format('MMMM Do YYYY, h:mm:ss a')}</td>
            </tr>
          </tbody>
        </table>
        <div className="pure-g transactionDetails">
          <div className="pure-u-1-2">
            <h3>Inputs</h3>
            {inputs}
          </div>
          <div className="pure-u-1-2">
            <h3>Outputs</h3>
            {outputs}
          </div>
        </div>
      </div>
    );
  }
}

export default withRouter(Transaction);