import { GraphQLResolveInfo } from 'graphql';

import { ShieldRule, ShieldContext, ShieldRuleResult } from './interface';
import { ShieldPluginOptions } from '../config';
import {
  TypeNameType,
  FieldNameType,
  RootValue,
  ArgsValue,
  GetGen,
} from '../typing';

export class LogicRule<
  TypeName extends TypeNameType,
  FieldName extends FieldNameType
> implements ShieldRule<TypeName, FieldName> {
  protected rules: ShieldRule<TypeName, FieldName>[];

  constructor(rules: ShieldRule<TypeName, FieldName>[]) {
    this.rules = rules;
  }

  /**
   * By default logic rule resolves to false.
   */
  async resolve(
    _root: RootValue<TypeName>,
    _args: ArgsValue<TypeName, FieldName>,
    _ctx: GetGen<'context'> & ShieldContext,
    _info: GraphQLResolveInfo,
    _options: ShieldPluginOptions
  ): Promise<ShieldRuleResult> {
    return false;
  }

  /**
   * Evaluates all the rules.
   */
  async evaluate(
    root: RootValue<TypeName>,
    args: ArgsValue<TypeName, FieldName>,
    ctx: GetGen<'context'> & ShieldContext,
    info: GraphQLResolveInfo,
    options: ShieldPluginOptions
  ): Promise<PromiseSettledResult<ShieldRuleResult>[]> {
    const tasks = this.rules.map((rule) =>
      rule.resolve(root, args, ctx, info, options)
    );

    return Promise.allSettled(tasks);
  }
}
