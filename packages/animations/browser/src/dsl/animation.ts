/**
 * @license
 * Copyright Google Inc. All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */
import {AnimationMetadata, ɵStyleData} from '@angular/animations';
import {normalizeStyles} from '../util';
import {AnimationAst} from './animation_ast';
import {buildAnimationAst} from './animation_ast_builder';
import {buildAnimationTimelines} from './animation_timeline_builder';
import {AnimationTimelineInstruction} from './animation_timeline_instruction';
import {ElementInstructionMap} from './element_instruction_map';

export class Animation {
  private _animationAst: AnimationAst;
  constructor(input: AnimationMetadata|AnimationMetadata[]) {
    const errors: any[] = [];
    const ast = buildAnimationAst(input, errors);
    if (errors.length) {
      const errorMessage = `animation validation failed:\n${errors.join("\n")}`;
      throw new Error(errorMessage);
    }
    this._animationAst = ast;
  }

  buildTimelines(
      element: any, startingStyles: ɵStyleData|ɵStyleData[],
      destinationStyles: ɵStyleData|ɵStyleData[], locals: {[key: string]: any},
      subInstructions: ElementInstructionMap = null): AnimationTimelineInstruction[] {
    const start = Array.isArray(startingStyles) ? normalizeStyles(startingStyles) :
                                                  <ɵStyleData>startingStyles;
    const dest = Array.isArray(destinationStyles) ? normalizeStyles(destinationStyles) :
                                                    <ɵStyleData>destinationStyles;
    const errors: any = [];
    subInstructions = subInstructions || new ElementInstructionMap();
    const result = buildAnimationTimelines(
        element, this._animationAst, start, dest, locals, subInstructions, errors);
    if (errors.length) {
      const errorMessage = `animation building failed:\n${errors.join("\n")}`;
      throw new Error(errorMessage);
    }
    return result;
  }
}
