import { defineConfig } from 'vite';
import * as path from 'path';

export default defineConfig( {
	build: {
		rollupOptions: {
			output: {
				entryFileNames: 'assets/[name].js',
				chunkFileNames: 'assets/[name].js',
				assetFileNames: 'assets/[name].[ext]'
			}
		}
	},
	resolve: {
		alias: {
			'@': path.resolve( __dirname, './src' )
		}
	}
} );
