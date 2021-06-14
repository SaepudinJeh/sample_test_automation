import LikeButtonInitiator from '../src/scripts/utils/like-button-initiator';
import FavoriteMovieIdb from '../src/scripts/data/favorite-movie-idb';
import * as TestFactories from './helpers/testFactories';

const addLikeButtonContainer = () => {
	document.body.innerHTML = '<div id="likeButtonContainer"></div>';
};

describe('Unlike A Movie', () => {

	beforeEach( async () => {
		addLikeButtonContainer();
		await FavoriteMovieIdb.putMovie({ id: 1});
	});

	afterEach( async () => {
		await FavoriteMovieIdb.deleteMovie(1);
	});

	// harus menampilkan widget tidak seperti saat film disukai
	it('should display unlike widget when the movie has been liked', async () => {
		await TestFactories.createLikeButtonPresenterWithMovie({ id: 1 });

		expect(document.querySelector('[aria-label="unlike this movie"]'))
      .toBeTruthy();
	});

	// seharusnya tidak ditampilkan seperti widget ketika film telah disukai
	it('should not display like widget when the movie has been liked', async () => {
		await TestFactories.createLikeButtonPresenterWithMovie({ id: 1 });

		expect(document.querySelector('[aria-label="like this movie"]'))
      .toBeFalsy();
	});

	// harus dapat menghapus film yang disukai dari daftar
	it('should be able to remove liked movie from the list', async () => {
		await TestFactories.createLikeButtonPresenterWithMovie({ id: 1 });

		document.querySelector('[aria-label="unlike this movie"]').dispatchEvent(new Event('click'));

		expect(await FavoriteMovieIdb.getAllMovies()).toEqual([]);
	})


	// tidak boleh melakukan kesalahan jika film yang tidak disukai tidak ada dalam daftar
	it('should not throw error if the unliked movie is not in the list', async () => {
		await TestFactories.createLikeButtonPresenterWithMovie({ id: 1 });

		// Hapus dulu film dari daftar film yang disukai
		await FavoriteMovieIdb.deleteMovie(1);

		// kemudian, simulasikan pengguna menekan widget batal menyukai film
		document.querySelector('[aria-label="unlike this movie"]').dispatchEvent(new Event('click'));

		expect(await FavoriteMovieIdb.getAllMovies()).toEqual([]);
	})

});