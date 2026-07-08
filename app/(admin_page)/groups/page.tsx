export default function Groups() {

    return (
        <div>
            <div className="card">
                <h1>Groups</h1>
                <hr></hr>
                <div className="">
                    <label htmlFor="pengguna">Pilih pengguna:</label>
                    <select id="pengguna" name="pengguna">
                        <option value="Auffa">Auffa</option>
                    </select>
                    <button type="submit">Assign</button>
                </div>
                <div className="">
                    <h2>Anggota Saat ini di Departemen PADI</h2>
                    <ul>
                        <li>Auffa</li>
                        <li>Aldi</li>
                        <li>Abdi</li>
                        <li>Akbar</li>
                        <li>Ridani</li>
                        <li>Tiara</li>
                    </ul>
                </div>
            </div>
        </div>
    )
}