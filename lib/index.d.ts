import { GraphQLSchema } from 'graphql';
export declare type Resolver = (args: any) => Promise<any> | any;
export declare type ResolverMapper = ({args: any, resolve: Resolver}) => Promise<any> | any;
export declare type Rule = boolean | ResolverMapper;
export interface Rules {
    [key: string]: Rule;
}
export declare function transformSchema(schema: GraphQLSchema, rules: Rules): GraphQLSchema;
