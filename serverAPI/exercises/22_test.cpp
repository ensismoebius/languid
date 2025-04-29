#include <gtest/gtest.h>

class Retangulo
{
public:
    int base, altura;
    int area() const { return base * altura; }
    int perimetro() const { return 2 * (base + altura); }
};

TEST(RetanguloTest, AreaEPerimetro)
{
    Retangulo r;
    r.base = 4;
    r.altura = 5;
    EXPECT_EQ(r.area(), 20);
    EXPECT_EQ(r.perimetro(), 18);
}
