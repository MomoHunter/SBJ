# Generierung:

1. (Einmal) per `pip install Pillow==5.3.0` dependencies installieren
2. per `python generate_spritesheet.py` aus den im `sprites`-Ordner vorhandenen Bildern ein neues Spritesheet und das
    Sprite-Dict automatisch generieren lassen


# Erstellen von Sprites:

*TODO: anpassen zu aktuellem Stand*

Es existieren verschiedene Kategorien an Sprites:
- Spielercharaktere
- ein Pointer
- Items
- Geldscheine
- Gegner (aktuell nur der Feuerball)
- Geldsymbol (Hype)
- Goldenes Kleeblatt
- Achievementsymbole
- Lautsprechersymbol

Alle nachfolgenden Angaben sind Breite x Höhe in Pixeln.

Spielercharaktere:
Diese gibt es in zwei Versionen:
1. Die Version, die im Spiel und an einigen anderen Stellen benutzt wird. Darf maximal 28x28 Pixel sein.
2. Die Version für den Shop und den Auswahlbildschirm. Darf maximal 58x58 Pixel sein. Normalerweise sollte die Version
    jedoch genau so, wie die andere aussehen.

Der Pointer:
Wird angezeigt, wenn der Spieler oberhalb des Fensters ist und nicht mehr sichtbar ist.

Items:
Gibt es ebenfalls in 2 Versionen:
1. Die Version, die im Spiel angezeigt wird. Darf maximal 20x20 Pixel sein.
2. Die Version, die im Shop benutzt wird. Darf maximal 58x58 Pixel sein.

Geldscheine:
Hier gibt es nur eine Version:
1. Die Version, die im Spiel angezeigt wird. Darf maximal 30x20 Pixel sein.

Gegner:
Hier gibt es ebenfalls nur eine Version:
1. Die Version, die im Spiel angezeigt wird. Darf maximal 16x16 Pixel sein, um eine gute Relation zum Spieler zu haben.

Geldsymbol:
Das Geldsymbol sollte mit "Hype" in Verbindung gebracht werden können. Das Symbol kann in beliebiger Größe erstellt
werden, sollte allerdings in mehreren Größen vorhanden sein und auch klein (ca. 7x10 Pixel) vorhanden sein.

Goldenes Kleeblatt:
Das ist ein seltenes Collectable, welches nur einmal in jedem Spiel vorkommt. Die maximale Größe hierfür ist 20x20 Pixel.

Achievementsymbole:
Jedes Achievement hat sein eigenes Icon. Momentan haben nur sehr wenige Achievements bereits Icons. Die Icons müssen in
2 Varianten voranden sein:
1. In der Variante, in der es in der Liste angezeigt wird. Hier darf es maximal 38x28 Pixel groß sein.
2. In der Variante, in der es rechts in groß angezeigt wird mit Informationen. Hier darf es maximal 78x78 Pixel sein.

Lautsprechersymbol:
Das ist das Symbol, welches im Hauptmenü oben rechts angezeigt wird, um die Musik zu muten. Das darf maximal 28x28 Pixel
groß sein.
